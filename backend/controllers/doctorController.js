const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Department = require("../models/Department");

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
  res.status(201).json({ data: doctor });
};

module.exports = { listDoctors, createDoctor };
