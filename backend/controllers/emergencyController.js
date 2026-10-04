const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");
const { createNotification } = require("../services/notificationService");

const createEmergencyRequest = async (req, res) => {
  const request = await EmergencyRequest.create({
    patientId: req.user.userId,
    symptoms: req.body.symptoms.trim(),
    assessmentId: req.body.assessmentId,
  });
  const responders = await User.find({ role: { $in: ["DOCTOR", "ADMIN"] }, isActive: true }).select("_id");
  await Promise.all(
    responders.map((responder) =>
      createNotification({
        recipient: responder._id,
        type: "EMERGENCY_NEW",
        title: "New emergency request",
        message: "A patient emergency request requires review.",
      })
    )
  );
  res.status(201).json({ data: request, message: "Emergency request recorded for review; emergency services have not been contacted." });
};

const listPatientEmergencyRequests = async (req, res) => {
  const data = await EmergencyRequest.find({ patientId: req.user.userId }).populate("assessmentId").sort({ createdAt: -1 });
  res.json({ data });
};

const listOperationalEmergencyRequests = async (req, res) => {
  const data = await EmergencyRequest.find().populate("patientId", "name email phone").populate("assessmentId").sort({ createdAt: 1 });
  res.json({ data });
};

const updateEmergencyStatus = async (req, res) => {
  const { status, resolutionNotes } = req.body;
  const allowed = ["NEW", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid emergency status" });
  const request = await EmergencyRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Emergency request not found" });
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
  await createNotification({
    recipient: request.patientId,
    type: "EMERGENCY_UPDATED",
    title: "Emergency request updated",
    message: `Your request status is now ${status}.`,
  });
  res.json({ data: request });
};

module.exports = { createEmergencyRequest, listPatientEmergencyRequests, listOperationalEmergencyRequests, updateEmergencyStatus };
