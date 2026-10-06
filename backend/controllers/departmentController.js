const Department = require("../models/Department");
const mongoose = require("mongoose");
const { writeAuditLog } = require("../services/auditLogService");

const listDepartments = async (req, res) => {
  const departments = await Department.find({ isActive: true }).sort({ name: 1 });
  res.json({ data: departments });
};

const listAllDepartments = async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json({ data: departments });
};

const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ message: "A non-empty department name is required" });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ message: "description must be a string" });
  }
  const department = await Department.create({ name: name.trim(), description });
  await writeAuditLog({
    req,
    action: "admin.department.created",
    resourceType: "DEPARTMENT",
    resourceId: department._id,
  });
  res.status(201).json({ data: department });
};

const updateDepartment = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Department id must be a valid identifier" });
  }
  const { name, description, isActive } = req.body;
  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    return res.status(400).json({ message: "name must be a non-empty string" });
  }
  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ message: "description must be a string" });
  }
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be a boolean" });
  }
  if (name === undefined && description === undefined && isActive === undefined) {
    return res.status(400).json({ message: "Provide a department field to update" });
  }

  const changes = {};
  if (name !== undefined) changes.name = name.trim();
  if (description !== undefined) changes.description = description;
  if (isActive !== undefined) changes.isActive = isActive;
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    { $set: changes },
    { new: true, runValidators: true }
  );
  if (!department) return res.status(404).json({ message: "Department not found" });
  await writeAuditLog({
    req,
    action: "admin.department.updated",
    resourceType: "DEPARTMENT",
    resourceId: department._id,
  });
  res.json({ data: department });
};

const deleteDepartment = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Department id must be a valid identifier" });
  }
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    { $set: { isActive: false } },
    { new: true }
  );
  if (!department) return res.status(404).json({ message: "Department not found" });
  await writeAuditLog({
    req,
    action: "admin.department.deleted",
    resourceType: "DEPARTMENT",
    resourceId: department._id,
  });
  res.json({ data: department });
};

module.exports = { listDepartments, listAllDepartments, createDepartment, updateDepartment, deleteDepartment };
