const mongoose = require("mongoose");

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateObjectId = (field) => (req, res, next) => {
  if (!isObjectId(req.body[field])) {
    return res.status(400).json({ message: `${field} must be a valid identifier` });
  }
  next();
};

const validateAppointment = (req, res, next) => {
  const { doctorId, departmentId, appointmentDate, appointmentTime, reason } = req.body;
  if (!doctorId || !departmentId || !appointmentDate || !appointmentTime || !reason) {
    return res.status(400).json({
      message: "doctorId, departmentId, appointmentDate, appointmentTime, and reason are required",
    });
  }
  if (!isObjectId(doctorId) || !isObjectId(departmentId)) {
    return res.status(400).json({ message: "doctorId and departmentId must be valid identifiers" });
  }
  if (Number.isNaN(Date.parse(appointmentDate))) {
    return res.status(400).json({ message: "appointmentDate must be a valid date" });
  }
  if (!/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(appointmentTime)) {
    return res.status(400).json({ message: "appointmentTime must use HH:MM format" });
  }
  if (new Date(`${appointmentDate}T${appointmentTime}:00`) <= new Date()) {
    return res.status(400).json({ message: "Appointments must be scheduled in the future" });
  }
  next();
};

const validateEmergency = (req, res, next) => {
  const { symptoms, assessmentId } = req.body;
  if (!symptoms || typeof symptoms !== "string" || !symptoms.trim()) {
    return res.status(400).json({ message: "symptoms is required" });
  }
  if (assessmentId && !isObjectId(assessmentId)) {
    return res.status(400).json({ message: "assessmentId must be a valid identifier" });
  }
  next();
};

module.exports = { isObjectId, validateObjectId, validateAppointment, validateEmergency };
