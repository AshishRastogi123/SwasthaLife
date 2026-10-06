const Department = require("../models/Department");
const { writeAuditLog } = require("../services/auditLogService");

const listDepartments = async (req, res) => {
  const departments = await Department.find({ isActive: true }).sort({ name: 1 });
  res.json({ data: departments });
};

const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "name is required" });
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
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
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

module.exports = { listDepartments, createDepartment, updateDepartment };
