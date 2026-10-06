const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");
const EmergencyRequest = require("../models/EmergencyRequest");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { writeAuditLog } = require("../services/auditLogService");
const AuditLog = require("../models/AuditLog");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAdminDashboard = async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [patients, doctors, departments, todayAppointments, pendingAppointments, emergencyRequests, activeUsers] = await Promise.all([
    User.countDocuments({ role: "PATIENT" }),
    User.countDocuments({ role: "DOCTOR" }),
    Department.countDocuments({ isActive: true }),
    Appointment.countDocuments({ appointmentDate: { $gte: startOfToday, $lt: endOfToday }, status: { $ne: "CANCELLED" } }),
    Appointment.countDocuments({ status: "PENDING" }),
    EmergencyRequest.countDocuments({ status: { $in: ["NEW", "ACKNOWLEDGED", "IN_PROGRESS"] } }),
    User.countDocuments({ isActive: true }),
  ]);

  res.json({
    data: {
      totalPatients: patients,
      totalDoctors: doctors,
      totalDepartments: departments,
      todayAppointments,
      pendingAppointments,
      emergencyRequests,
      activeUsers,
    },
  });
};

const listUsers = async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
  const filter = {};

  if (req.query.role) {
    if (!["PATIENT", "DOCTOR", "ADMIN"].includes(req.query.role)) {
      return res.status(400).json({ message: "Invalid role filter" });
    }
    filter.role = req.query.role;
  }
  if (req.query.status) {
    if (!["active", "inactive"].includes(req.query.status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }
    filter.isActive = req.query.status === "active";
  }
  if (req.query.search?.trim()) {
    const search = new RegExp(escapeRegex(req.query.search.trim()), "i");
    filter.$or = [{ name: search }, { email: search }];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("name email role phone isActive createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  res.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    },
  });
};

const updateUserStatus = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "User id must be a valid identifier" });
  }
  if (typeof req.body.isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be a boolean" });
  }
  if (req.params.id === req.user.userId && req.body.isActive === false) {
    return res.status(400).json({ message: "You cannot deactivate your own account" });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { isActive: req.body.isActive } },
    { new: true, runValidators: true }
  ).select("name email role phone isActive createdAt");
  if (!user) return res.status(404).json({ message: "User not found" });
  await writeAuditLog({
    req,
    action: req.body.isActive ? "admin.user.activated" : "admin.user.deactivated",
    resourceType: "USER",
    resourceId: user._id,
  });
  res.json({ data: user });
};

const createUser = async (req, res) => {
  const { name, email, password, phone, role = "PATIENT" } = req.body;
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ message: "A non-empty name is required" });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "A valid email is required" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  if (phone !== undefined && typeof phone !== "string") {
    return res.status(400).json({ message: "Phone must be a string" });
  }
  if (!["PATIENT", "DOCTOR"].includes(role)) {
    return res.status(400).json({ message: "Admin can create PATIENT or DOCTOR accounts only" });
  }

  let department;
  if (role === "DOCTOR") {
    if (!mongoose.Types.ObjectId.isValid(req.body.departmentId)) {
      return res.status(400).json({ message: "A valid departmentId is required for doctor accounts" });
    }
    if (typeof req.body.licenseNumber !== "string" || !req.body.licenseNumber.trim()) {
      return res.status(400).json({ message: "licenseNumber is required for doctor accounts" });
    }
    department = await Department.findOne({ _id: req.body.departmentId, isActive: true });
    if (!department) return res.status(400).json({ message: "Select an active department" });
  }

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: await bcrypt.hash(password, 10),
    phone,
    role,
  });

  let doctor;
  if (role === "DOCTOR") {
    try {
      doctor = await Doctor.create({
        userId: user._id,
        departmentId: department._id,
        licenseNumber: req.body.licenseNumber.trim(),
        qualifications: req.body.qualifications,
        bio: req.body.bio,
      });
    } catch (error) {
      await User.deleteOne({ _id: user._id });
      throw error;
    }
  }

  await writeAuditLog({
    req,
    action: "admin.user.created",
    resourceType: "USER",
    resourceId: user._id,
  });
  res.status(201).json({
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      ...(doctor ? { doctorId: doctor._id } : {}),
    },
  });
};

const auditActions = [
  "auth.login.success",
  "auth.login.failure",
  "auth.logout",
  "admin.user.activated",
  "admin.user.deactivated",
  "admin.user.created",
  "admin.doctor.created",
  "admin.department.created",
  "admin.department.updated",
  "admin.department.deleted",
  "doctor.availability.slot_added",
  "doctor.availability.slot_removed",
  "appointment.created",
  "appointment.confirmed",
  "appointment.cancelled",
  "appointment.completed",
  "appointment.status_changed",
  "emergency.created",
  "emergency.acknowledged",
  "emergency.status_changed",
  "emergency.resolved",
  "doctor.assessment.reviewed",
  "doctor.note.created",
  "security.unauthorized",
];
const auditRoles = ["PATIENT", "DOCTOR", "ADMIN", "UNKNOWN"];

const listAuditLogs = async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 25, 1), 100);
  const match = {};

  if (req.query.action) {
    if (!auditActions.includes(req.query.action)) {
      return res.status(400).json({ message: "Invalid audit action filter" });
    }
    match.action = req.query.action;
  }
  if (req.query.role) {
    if (!auditRoles.includes(req.query.role)) {
      return res.status(400).json({ message: "Invalid role filter" });
    }
    match.actorRole = req.query.role;
  }
  if (req.query.userId) {
    if (!mongoose.Types.ObjectId.isValid(req.query.userId)) {
      return res.status(400).json({ message: "userId must be a valid identifier" });
    }
    match.actorUserId = new mongoose.Types.ObjectId(req.query.userId);
  }
  if (req.query.startDate || req.query.endDate) {
    const dateRange = {};
    if (req.query.startDate) {
      const start = new Date(req.query.startDate);
      if (Number.isNaN(start.getTime())) return res.status(400).json({ message: "startDate must be valid" });
      dateRange.$gte = start;
    }
    if (req.query.endDate) {
      const end = new Date(req.query.endDate);
      if (Number.isNaN(end.getTime())) return res.status(400).json({ message: "endDate must be valid" });
      if (/^\d{4}-\d{2}-\d{2}$/.test(req.query.endDate)) end.setUTCDate(end.getUTCDate() + 1);
      dateRange.$lt = end;
    }
    if (dateRange.$gte && dateRange.$lt && dateRange.$gte >= dateRange.$lt) {
      return res.status(400).json({ message: "startDate must be before endDate" });
    }
    match.timestamp = dateRange;
  }

  const pipeline = [{ $match: match }];
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  if (search) {
    const expression = new RegExp(escapeRegex(search.slice(0, 100)), "i");
    pipeline.push(
      {
        $lookup: {
          from: User.collection.name,
          localField: "actorUserId",
          foreignField: "_id",
          as: "actor",
        },
      },
      { $unwind: { path: "$actor", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { action: expression },
            { resourceType: expression },
            { resourceId: expression },
            { "actor.name": expression },
            { "actor.email": expression },
          ],
        },
      }
    );
  }
  pipeline.push({
    $facet: {
      data: [
        { $sort: { timestamp: -1, _id: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            actorUserId: 1,
            actorRole: 1,
            action: 1,
            resourceType: 1,
            resourceId: 1,
            timestamp: 1,
            context: 1,
            success: 1,
            failureReason: 1,
            changes: 1,
            actor: { _id: "$actor._id", name: "$actor.name", email: "$actor.email" },
          },
        },
      ],
      total: [{ $count: "count" }],
    },
  });
  const [result] = await AuditLog.aggregate(pipeline);
  const total = result?.total[0]?.count || 0;
  res.json({
    data: result?.data || [],
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    },
  });
};

module.exports = { getAdminDashboard, listUsers, createUser, updateUserStatus, listAuditLogs };
