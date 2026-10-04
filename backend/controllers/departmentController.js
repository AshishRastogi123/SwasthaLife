const Department = require("../models/Department");

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
  res.status(201).json({ data: department });
};

const updateDepartment = async (req, res) => {
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!department) return res.status(404).json({ message: "Department not found" });
  res.json({ data: department });
};

module.exports = { listDepartments, createDepartment, updateDepartment };
