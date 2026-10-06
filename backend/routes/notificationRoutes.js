const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  listNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");

const router = express.Router();
router.use(authMiddleware);
router.use(requireRole("PATIENT", "DOCTOR", "ADMIN"));
router.get("/", listNotifications);
router.get("/unread-count", getUnreadNotificationCount);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllNotificationsRead);

module.exports = router;
