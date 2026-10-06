const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");
const Prediction = require("../models/Prediction");
const EmergencyRequest = require("../models/EmergencyRequest");
const { writeAuditLog } = require("../services/auditLogService");

const listDoctors = async (req, res) => {
  const doctors = await Doctor.find({ isAvailable: true })
    .populate("userId", "name email phone")
    .populate("departmentId", "name")
    .sort({ createdAt: -1 });
  res.json({ data: doctors });
};

const createDoctor = async (req, res) => {
  const { userId, departmentId, licenseNumber, qualifications, bio, availableSlots } = req.body;
  if (!userId || !departmentId || !licenseNumber) {
    return res.status(400).json({ message: "userId, departmentId, and licenseNumber are required" });
  }
  const [user, department] = await Promise.all([
    User.findById(userId),
    Department.findById(departmentId),
  ]);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!department) return res.status(404).json({ message: "Department not found" });
  if (user.role === "ADMIN") {
    return res.status(400).json({ message: "An admin account cannot be assigned as a doctor" });
  }
  user.role = "DOCTOR";
  await user.save();
  const doctor = await Doctor.create({
    userId,
    departmentId,
    licenseNumber,
    qualifications,
    bio,
    availableSlots,
  });
  await writeAuditLog({
    req,
    action: "admin.doctor.created",
    resourceType: "DOCTOR",
    resourceId: doctor._id,
  });
  res.status(201).json({ data: doctor });
};

const getDoctorDashboardStats = async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user.userId }).select("_id");
  if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);
  const appointmentFilter = { doctorId: doctor._id };
  const [today, pending, confirmed, completed, assignedAssessmentIds, assignedPatientIds] = await Promise.all([
    Appointment.countDocuments({
      ...appointmentFilter,
      appointmentDate: { $gte: startOfToday, $lt: endOfToday },
      status: { $nin: ["CANCELLED"] },
    }),
    Appointment.countDocuments({ ...appointmentFilter, status: "PENDING" }),
    Appointment.countDocuments({ ...appointmentFilter, status: "CONFIRMED" }),
    Appointment.countDocuments({ ...appointmentFilter, status: "COMPLETED" }),
    Appointment.distinct("assessmentId", { ...appointmentFilter, assessmentId: { $ne: null } }),
    Appointment.distinct("patientId", { doctorId: doctor._id }),
  ]);
  const [pendingReviews, emergencyRequests] = await Promise.all([
    Prediction.countDocuments({ _id: { $in: assignedAssessmentIds }, reviewStatus: "PENDING" }),
    EmergencyRequest.countDocuments({
      patientId: { $in: assignedPatientIds },
      status: { $in: ["NEW", "ACKNOWLEDGED", "IN_PROGRESS"] },
    }),
  ]);

  res.json({
    data: {
      todayAppointments: today,
      pendingAppointments: pending,
      confirmedAppointments: confirmed,
      completedAppointments: completed,
      pendingAssessmentReviews: pendingReviews,
      emergencyRequestsRequiringAttention: emergencyRequests,
    },
  });
};

module.exports = { listDoctors, createDoctor, getDoctorDashboardStats };
