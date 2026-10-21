const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const requireCurrentHealthConsent = require("../middleware/requireCurrentHealthConsent");
const chatbotRateLimit = require("../middleware/chatbotRateLimit");
const { replyToMessage, checkServiceHealth } = require("../controllers/chatbotController");

const router = express.Router();

router.get("/health", checkServiceHealth);
router.post(
  ["/", "/chat"],
  authMiddleware,
  requireRole("PATIENT"),
  requireCurrentHealthConsent,
  chatbotRateLimit,
  replyToMessage
);

module.exports = router;
