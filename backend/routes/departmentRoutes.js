const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  listDepartments,
  listAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const router = express.Router();
router.get("/manage", authMiddleware, requireRole("ADMIN"), listAllDepartments);
router.get("/", listDepartments);
router.post("/", authMiddleware, requireRole("ADMIN"), createDepartment);
router.patch("/:id", authMiddleware, requireRole("ADMIN"), updateDepartment);
router.delete("/:id", authMiddleware, requireRole("ADMIN"), deleteDepartment);

module.exports = router;
