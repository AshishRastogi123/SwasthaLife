const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const { createNotification } = require("../services/notificationService");

const appointmentQuery = () =>
  Appointment.find()
    .populate("patientId", "name email phone")
    .populate({ path: "doctorId", populate: [{ path: "userId", select: "name email" }, { path: "departmentId", select: "name" }] })
    .populate("departmentId", "name")
    .populate("assessmentId");

const createAppointment = async (req, res) => {
  const { doctorId, departmentId, appointmentDate, appointmentTime, reason, assessmentId } = req.body;
  const [doctor, department] = await Promise.all([
    Doctor.findById(doctorId).populate("userId", "_id"),
    Department.findOne({ _id: departmentId, isActive: true }),
  ]);
  if (!doctor || !doctor.isAvailable) return res.status(404).json({ message: "Available doctor not found" });
  if (!department || doctor.departmentId.toString() !== department._id.toString()) {
    return res.status(400).json({ message: "Doctor does not belong to the selected department" });
  }
  if (!doctor.availableSlots?.includes(appointmentTime)) {
    return res.status(409).json({ message: "The selected doctor is not available at that time" });
  }
  if (assessmentId) {
    const Prediction = require("../models/Prediction");
    const assessment = await Prediction.findOne({ _id: assessmentId, userId: req.user.userId });
    if (!assessment) return res.status(403).json({ message: "Assessment is not associated with this patient" });
  }
  const existingAppointment = await Appointment.findOne({
    doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: { $in: ["PENDING", "CONFIRMED", "COMPLETED", "NO_SHOW"] },
  });
  if (existingAppointment) return res.status(409).json({ message: "The selected appointment slot is already booked" });
  const appointment = await Appointment.create({
    patientId: req.user.userId,
    doctorId,
    departmentId,
    appointmentDate,
    appointmentTime,
    reason,
    assessmentId,
  });
  await createNotification({
    recipient: doctor.userId._id,
    type: "APPOINTMENT_CREATED",
    title: "New appointment request",
    message: "A patient has requested an appointment.",
  });
  res.status(201).json({ data: appointment, message: "Appointment request persisted successfully" });
};

const listPatientAppointments = async (req, res) => {
  const filter = { patientId: req.user.userId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) filter.appointmentDate = new Date(req.query.date);
  const data = await appointmentQuery().where(filter).sort({ appointmentDate: -1 });
  res.json({ data });
};

const listDoctorAppointments = async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user.userId });
  if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
  const filter = { doctorId: doctor._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) filter.appointmentDate = new Date(req.query.date);
  const data = await appointmentQuery().where(filter).sort({ appointmentDate: 1 });
  res.json({ data });
};

const listAllAppointments = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) filter.appointmentDate = new Date(req.query.date);
  const data = await appointmentQuery().where(filter).sort({ appointmentDate: -1 });
  res.json({ data });
};

const listAvailableSlots = async (req, res) => {
  const { doctorId, date } = req.query;
  if (!doctorId || !date || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ message: "doctorId and a valid date are required" });
  }
  const doctor = await Doctor.findById(doctorId).select("availableSlots isAvailable");
  if (!doctor || !doctor.isAvailable) return res.status(404).json({ message: "Available doctor not found" });
  const booked = await Appointment.find({
    doctorId,
    appointmentDate: new Date(date),
    status: { $in: ["PENDING", "CONFIRMED", "COMPLETED", "NO_SHOW"] },
  }).select("appointmentTime");
  const bookedSlots = new Set(booked.map((appointment) => appointment.appointmentTime));
  res.json({ data: doctor.availableSlots.filter((slot) => !bookedSlots.has(slot)) });
};

const updateAppointmentStatus = async (req, res) => {
  const { status, clinicalNotes } = req.body;
  const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid appointment status" });
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  if (req.user.role === "DOCTOR") {
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) return res.status(403).json({ message: "Appointment not assigned to doctor" });
  }
  if (req.user.role === "PATIENT" && (appointment.patientId.toString() !== req.user.userId || status !== "CANCELLED")) {
    return res.status(403).json({ message: "Patients may only cancel their own appointments" });
  }
  const transitions = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
    COMPLETED: [],
    NO_SHOW: [],
    CANCELLED: [],
  };
  if (!transitions[appointment.status].includes(status)) {
    return res.status(409).json({ message: `Cannot change ${appointment.status} appointment to ${status}` });
  }
  if (
    req.user.role === "PATIENT" &&
    !["PENDING", "CONFIRMED"].includes(appointment.status)
  ) {
    return res.status(409).json({ message: "This appointment can no longer be cancelled" });
  }
  appointment.status = status;
  if (clinicalNotes !== undefined) appointment.clinicalNotes = clinicalNotes;
  if (status === "COMPLETED") appointment.reviewedAt = new Date();
  await appointment.save();
  await createNotification({
    recipient: appointment.patientId,
    type: "APPOINTMENT_UPDATED",
    title: "Appointment updated",
    message: `Your appointment status is now ${status}.`,
  });
  res.json({ data: appointment });
};

module.exports = {
  createAppointment,
  listPatientAppointments,
  listDoctorAppointments,
  listAllAppointments,
  listAvailableSlots,
  updateAppointmentStatus,
};
