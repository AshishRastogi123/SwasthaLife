const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { listNotifications, markNotificationRead, markAllNotificationsRead } = require("../controllers/notificationController");

const router = express.Router();
router.use(authMiddleware);
router.get("/", listNotifications);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllNotificationsRead);

module.exports = router;
