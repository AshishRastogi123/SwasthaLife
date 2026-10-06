const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const {
  createNotification,
  createNotifications,
} = require("../services/notificationService");
const { writeAuditLog } = require("../services/auditLogService");

const getEmergencyRecipientIds = async (patientId) => {
  const [doctorIds, admins] = await Promise.all([
    Appointment.distinct("doctorId", { patientId }),
    User.find({ role: "ADMIN", isActive: true }).select("_id"),
  ]);
  const doctors = await Doctor.find({ _id: { $in: doctorIds } })
    .populate({ path: "userId", match: { isActive: true }, select: "_id" })
    .select("userId");
  return [
    ...admins.map((admin) => admin._id),
    ...doctors.map((doctor) => doctor.userId?._id).filter(Boolean),
  ];
};

const createEmergencyRequest = async (req, res) => {
  const request = await EmergencyRequest.create({
    patientId: req.user.userId,
    symptoms: req.body.symptoms.trim(),
    assessmentId: req.body.assessmentId,
  });
  await writeAuditLog({
    req,
    action: "emergency.created",
    resourceType: "EMERGENCY",
    resourceId: request._id,
  });
  const responders = await getEmergencyRecipientIds(request.patientId);
  await Promise.all([
    createNotifications(responders, {
      type: "EMERGENCY_NEW",
      title: "New emergency request",
      message: "An emergency request requires review.",
      relatedEntityType: "EMERGENCY",
      relatedEntityId: request._id,
    }),
    createNotification({
      recipient: request.patientId,
      type: "EMERGENCY_SUBMITTED",
      title: "Emergency request submitted",
      message: "Your emergency request has been submitted for review.",
      relatedEntityType: "EMERGENCY",
      relatedEntityId: request._id,
    }),
  ]);
  res.status(201).json({ data: request, message: "Emergency request recorded for review; emergency services have not been contacted." });
};

const listPatientEmergencyRequests = async (req, res) => {
  const data = await EmergencyRequest.find({ patientId: req.user.userId }).populate("assessmentId").sort({ createdAt: -1 });
  res.json({ data });
};

const listOperationalEmergencyRequests = async (req, res) => {
  let filter = {};
  if (req.user.role === "DOCTOR") {
    const doctor = await Doctor.findOne({ userId: req.user.userId }).select("_id");
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    const patientIds = await Appointment.distinct("patientId", { doctorId: doctor._id });
    filter.patientId = { $in: patientIds };
  }
  const data = await EmergencyRequest.find(filter).populate("patientId", "name email phone").populate("assessmentId").sort({ createdAt: 1 });
  res.json({ data });
};

const updateEmergencyStatus = async (req, res) => {
  const { status, resolutionNotes } = req.body;
  const allowed = ["NEW", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid emergency status" });
  const request = await EmergencyRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Emergency request not found" });
  if (req.user.role === "DOCTOR") {
    const doctor = await Doctor.findOne({ userId: req.user.userId }).select("_id");
    const assigned = doctor && await Appointment.exists({ doctorId: doctor._id, patientId: request.patientId });
    if (!assigned) return res.status(403).json({ message: "Emergency request is not assigned to this doctor" });
  }
  const transitions = {
    NEW: ["ACKNOWLEDGED", "CANCELLED"],
    ACKNOWLEDGED: ["IN_PROGRESS", "RESOLVED", "CANCELLED"],
    IN_PROGRESS: ["RESOLVED", "CANCELLED"],
    RESOLVED: [],
    CANCELLED: [],
  };
  if (!transitions[request.status].includes(status)) {
    return res.status(409).json({ message: `Cannot change ${request.status} emergency request to ${status}` });
  }
  const previousStatus = request.status;
  request.status = status;
  if (status === "ACKNOWLEDGED" && !request.acknowledgedAt) {
    request.acknowledgedBy = req.user.userId;
    request.acknowledgedAt = new Date();
  }
  if (status === "RESOLVED") {
    request.resolvedAt = new Date();
    request.resolutionNotes = resolutionNotes;
  }
  await request.save();
  const actionByStatus = {
    ACKNOWLEDGED: "emergency.acknowledged",
    RESOLVED: "emergency.resolved",
  };
  await writeAuditLog({
    req,
    action: actionByStatus[status] || "emergency.status_changed",
    resourceType: "EMERGENCY",
    resourceId: request._id,
    changes: { fromStatus: previousStatus, toStatus: status },
  });
  const statusNotifications = {
    ACKNOWLEDGED: {
      type: "EMERGENCY_ACKNOWLEDGED",
      title: "Emergency request acknowledged",
      message: "Your emergency request has been acknowledged.",
    },
    IN_PROGRESS: {
      type: "EMERGENCY_IN_PROGRESS",
      title: "Emergency response in progress",
      message: "A response to your emergency request is in progress.",
    },
    RESOLVED: {
      type: "EMERGENCY_RESOLVED",
      title: "Emergency request resolved",
      message: "Your emergency request has been resolved.",
    },
    CANCELLED: {
      type: "EMERGENCY_CANCELLED",
      title: "Emergency request cancelled",
      message: "Your emergency request has been cancelled.",
    },
  };
  const authorizedRecipients = await getEmergencyRecipientIds(request.patientId);
  await createNotifications(
    [request.patientId, ...authorizedRecipients].filter(
      (recipient) => recipient.toString() !== req.user.userId
    ),
    {
      ...statusNotifications[status],
      relatedEntityType: "EMERGENCY",
      relatedEntityId: request._id,
    }
  );
  res.json({ data: request });
};

module.exports = { createEmergencyRequest, listPatientEmergencyRequests, listOperationalEmergencyRequests, updateEmergencyStatus };
