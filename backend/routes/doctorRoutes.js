const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  listDoctors,
  createDoctor,
  getDoctorDashboardStats,
  updateDoctorSlot,
} = require("../controllers/doctorController");

const router = express.Router();
router.get("/", listDoctors);
router.get("/me/dashboard", authMiddleware, requireRole("DOCTOR"), getDoctorDashboardStats);
router.patch("/me/slots", authMiddleware, requireRole("DOCTOR"), updateDoctorSlot);
router.post("/", authMiddleware, requireRole("ADMIN"), createDoctor);

module.exports = router;
