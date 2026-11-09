const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const { writeAuditLog } = require("../services/auditLogService");
const {
  uploadDoctorDocument,
  deleteDoctorDocument,
  createDoctorDocumentSignedUrl,
} = require("../services/doctorVerificationStorage");

const listDoctorVerifications = async (req, res, next) => {
  try {
    const status = req.query.status || "PENDING";
    if (!["NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid doctor verification status" });
    }

    const users = await User.find({
      role: "DOCTOR",
      "doctorVerification.status": status,
    })
      .select("name email professionalProfile doctorVerification.status doctorVerification.document.originalName doctorVerification.document.mimeType doctorVerification.document.sizeBytes doctorVerification.document.uploadedAt +doctorVerification.document.storagePath")
      .sort({ updatedAt: -1 })
      .limit(100);
    const doctorProfiles = await Doctor.find({ userId: { $in: users.map((user) => user._id) } })
      .select("userId licenseNumber departmentId")
      .populate("departmentId", "name")
      .lean();
    const doctorByUserId = new Map(doctorProfiles.map((doctor) => [doctor.userId.toString(), doctor]));

    const data = await Promise.all(users.map(async (user) => {
      const document = user.doctorVerification?.document;
      const doctor = doctorByUserId.get(user._id.toString());
      const signedUrl = document?.storagePath
        ? await createDoctorDocumentSignedUrl(document.storagePath)
        : null;
      if (signedUrl) {
        await writeAuditLog({
          req,
          action: "admin.doctor.verification.document_viewed",
          resourceType: "DOCTOR",
          resourceId: user._id,
        });
      }
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        licenseNumber: doctor?.licenseNumber || "",
        department: doctor?.departmentId?.name || "",
        professionalProfile: user.professionalProfile || {},
        verification: {
          status: user.doctorVerification?.status || "NOT_SUBMITTED",
          document: document?.storagePath ? {
            originalName: document.originalName,
            mimeType: document.mimeType,
            sizeBytes: document.sizeBytes,
            uploadedAt: document.uploadedAt,
            signedUrl,
            expiresInSeconds: 300,
          } : null,
        },
      };
    }));

    return res.json({ data });
  } catch (error) {
    return next(error);
  }
};

const reviewDoctorVerification = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "User id must be a valid identifier" });
    }
    const { action, reviewNote = "" } = req.body;
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "action must be approve or reject" });
    }
    if (typeof reviewNote !== "string" || reviewNote.trim().length > 1000) {
      return res.status(400).json({ message: "reviewNote must be at most 1000 characters" });
    }

    const user = await User.findOne({
      _id: req.params.userId,
      role: "DOCTOR",
    }).select("+doctorVerification.document.storagePath");
    if (!user) return res.status(404).json({ message: "Doctor account not found" });
    if (user.doctorVerification?.status !== "PENDING") {
      return res.status(409).json({ message: "Only pending doctor applications can be reviewed" });
    }
    if (action === "approve" && !user.doctorVerification?.document?.storagePath) {
      return res.status(400).json({ message: "A verification document must be uploaded before approval" });
    }

    user.doctorVerification.status = action === "approve" ? "APPROVED" : "REJECTED";
    user.doctorVerification.reviewedBy = req.user.userId;
    user.doctorVerification.reviewedAt = new Date();
    user.doctorVerification.reviewNote = reviewNote.trim();
    await user.save();

    const doctor = await Doctor.findOne({ userId: user._id });
    if (doctor) {
      doctor.isAvailable = action === "approve";
      await doctor.save();
    }

    await writeAuditLog({
      req,
      action: `admin.doctor.verification.${action}d`,
      resourceType: "DOCTOR",
      resourceId: user._id,
      changes: { verificationStatus: user.doctorVerification.status },
    });

    return res.json({
      message: `Doctor verification ${action}d`,
      data: {
        userId: user._id.toString(),
        status: user.doctorVerification.status,
        reviewedAt: user.doctorVerification.reviewedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getOwnVerificationDocument = async (req, res, next) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res.status(403).json({ message: "Doctor account required" });
    }
    const user = await User.findById(req.user.userId)
      .select("doctorVerification.status doctorVerification.document.originalName doctorVerification.document.mimeType doctorVerification.document.uploadedAt +doctorVerification.document.storagePath");
    const document = user?.doctorVerification?.document;
    if (!document?.storagePath) {
      return res.status(404).json({ message: "No verification document has been submitted" });
    }
    const signedUrl = await createDoctorDocumentSignedUrl(document.storagePath);
    await writeAuditLog({
      req,
      action: "doctor.verification.document_viewed",
      resourceType: "DOCTOR",
      resourceId: user._id,
    });
    return res.json({
      data: {
        status: user.doctorVerification.status,
        document: {
          originalName: document.originalName,
          mimeType: document.mimeType,
          uploadedAt: document.uploadedAt,
          signedUrl,
          expiresInSeconds: 300,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

const replaceOwnVerificationDocument = async (req, res, next) => {
  let uploadedDocument;
  try {
    if (req.user.role !== "DOCTOR") {
      return res.status(403).json({ message: "Doctor account required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "A license or registration certificate document is required" });
    }
    const user = await User.findById(req.user.userId)
      .select("role doctorVerification.status +doctorVerification.document.storagePath");
    if (!user) return res.status(404).json({ message: "Doctor account not found" });
    if (user.doctorVerification?.status === "APPROVED") {
      return res.status(409).json({ message: "Approved verification documents cannot be replaced" });
    }

    uploadedDocument = await uploadDoctorDocument(user._id.toString(), req.file);
    const previousPath = user.doctorVerification?.document?.storagePath;
    user.doctorVerification.status = "PENDING";
    user.doctorVerification.document = uploadedDocument;
    user.doctorVerification.reviewedBy = undefined;
    user.doctorVerification.reviewedAt = undefined;
    user.doctorVerification.reviewNote = undefined;
    await user.save();

    if (previousPath) {
      try {
        await deleteDoctorDocument(previousPath);
      } catch (cleanupError) {
        console.error("Failed to remove a replaced doctor verification document:", cleanupError.message);
      }
    }
    return res.status(200).json({ message: "Verification document submitted for review", data: { status: "PENDING" } });
  } catch (error) {
    if (uploadedDocument) {
      try {
        await deleteDoctorDocument(uploadedDocument.storagePath);
      } catch (cleanupError) {
        console.error("Failed to clean up an unclaimed doctor document:", cleanupError.message);
      }
    }
    return next(error);
  }
};

module.exports = {
  listDoctorVerifications,
  reviewDoctorVerification,
  getOwnVerificationDocument,
  replaceOwnVerificationDocument,
};
