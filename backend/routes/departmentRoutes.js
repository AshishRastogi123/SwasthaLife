const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { listDepartments, createDepartment, updateDepartment } = require("../controllers/departmentController");

const router = express.Router();
router.get("/", listDepartments);
router.post("/", authMiddleware, requireRole("ADMIN"), createDepartment);
router.patch("/:id", authMiddleware, requireRole("ADMIN"), updateDepartment);

module.exports = router;
