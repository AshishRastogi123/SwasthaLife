const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getAdminDashboard, listAuditLogs } = require("../controllers/adminController");
const {
  listDoctorVerifications,
  reviewDoctorVerification,
} = require("../controllers/doctorVerificationController");

const router = express.Router();
router.use(authMiddleware, requireRole("ADMIN"));
router.get("/dashboard", getAdminDashboard);
router.get("/audit-logs", listAuditLogs);
router.get("/doctor-verifications", listDoctorVerifications);
router.patch("/doctor-verifications/:userId", reviewDoctorVerification);

module.exports = router;
