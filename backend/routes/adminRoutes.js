const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getAdminDashboard, listAuditLogs } = require("../controllers/adminController");

const router = express.Router();
router.use(authMiddleware, requireRole("ADMIN"));
router.get("/dashboard", getAdminDashboard);
router.get("/audit-logs", listAuditLogs);

module.exports = router;
