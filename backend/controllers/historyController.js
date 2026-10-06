const mongoose = require("mongoose");
const Prediction = require("../models/Prediction");
const Appointment = require("../models/Appointment");
const EmergencyRequest = require("../models/EmergencyRequest");
const Doctor = require("../models/Doctor");

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const parsePagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  return { page, limit };
};

const canDoctorAccessPatient = async (doctorUserId, patientId) => {
  const doctor = await Doctor.findOne({ userId: doctorUserId }).select("_id");
  if (!doctor) return false;
  return Appointment.exists({ doctorId: doctor._id, patientId });
};

const resolvePatientId = async (req, res) => {
  if (req.user.role === "PATIENT") {
    if (req.params.patientId && req.params.patientId !== req.user.userId.toString()) {
      res.status(403).json({ message: "Patients may only access their own history" });
      return null;
    }
    return req.user.userId;
  }

  if (!req.params.patientId || !mongoose.Types.ObjectId.isValid(req.params.patientId)) {
    res.status(400).json({ message: "A valid patientId is required" });
    return null;
  }

  if (req.user.role === "DOCTOR" && !(await canDoctorAccessPatient(req.user.userId, req.params.patientId))) {
    res.status(403).json({ message: "Doctor is not assigned to this patient" });
    return null;
  }

  return req.params.patientId;
};

const buildHistory = async (patientId, limit) => {
  const fetchLimit = Math.min(limit * 5, 250);
  const [
    assessments,
    assessmentCount,
    appointments,
    appointmentCount,
    emergencies,
    emergencyCount,
  ] = await Promise.all([
    Prediction.find({ userId: patientId })
      .select("createdAt updatedAt symptoms prediction diseaseContext reviewStatus reviewedBy reviewedAt clinicalNotes")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(fetchLimit)
      .lean(),
    Prediction.countDocuments({ userId: patientId }),
    Appointment.find({ patientId })
      .select("createdAt updatedAt appointmentDate appointmentTime reason status doctorId departmentId assessmentId clinicalNotes reviewedAt")
      .populate({ path: "doctorId", populate: { path: "userId", select: "name email" } })
      .populate("departmentId", "name")
      .sort({ appointmentDate: -1, createdAt: -1 })
      .limit(fetchLimit)
      .lean(),
    Appointment.countDocuments({ patientId }),
    EmergencyRequest.find({ patientId })
      .select("createdAt updatedAt symptoms status assessmentId acknowledgedBy acknowledgedAt resolvedAt resolutionNotes")
      .populate("acknowledgedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(fetchLimit)
      .lean(),
    EmergencyRequest.countDocuments({ patientId }),
  ]);

  const timeline = [
    ...assessments.map((item) => ({
      id: `assessment-${item._id}`,
      type: "ASSESSMENT",
      date: item.createdAt,
      title: "Health assessment",
      status: item.reviewStatus,
      summary: item.prediction?.status === "UNAVAILABLE"
        ? "Assessment saved; automated result unavailable."
        : item.prediction?.disease
          ? `Possible condition: ${item.prediction.disease}`
          : "Assessment saved.",
      symptoms: item.symptoms,
      review: item.reviewStatus === "REVIEWED" ? {
        reviewedAt: item.reviewedAt,
        reviewer: item.reviewedBy,
        notes: item.clinicalNotes,
      } : null,
    })),
    ...appointments.map((item) => ({
      id: `appointment-${item._id}`,
      type: "APPOINTMENT",
      date: item.appointmentDate || item.createdAt,
      title: "Appointment",
      status: item.status,
      summary: item.reason,
      appointmentDate: item.appointmentDate,
      appointmentTime: item.appointmentTime,
      doctor: item.doctorId?.userId,
      department: item.departmentId,
      review: item.status === "COMPLETED" ? {
        reviewedAt: item.reviewedAt,
        notes: item.clinicalNotes,
      } : null,
    })),
    ...emergencies.map((item) => ({
      id: `emergency-${item._id}`,
      type: "EMERGENCY",
      date: item.createdAt,
      title: "Emergency request",
      status: item.status,
      summary: item.symptoms,
      review: item.status === "RESOLVED" ? {
        reviewedAt: item.resolvedAt,
        notes: item.resolutionNotes,
      } : null,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    timeline,
    total: assessmentCount + appointmentCount + emergencyCount,
  };
};

const getPatientHistory = async (req, res) => {
  const patientId = await resolvePatientId(req, res);
  if (!patientId) return;

  const { page, limit } = parsePagination(req.query);
  const { timeline, total } = await buildHistory(patientId, limit);
  const start = (page - 1) * limit;

  res.json({
    data: timeline.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNextPage: start + limit < total,
    },
  });
};

module.exports = { getPatientHistory };
