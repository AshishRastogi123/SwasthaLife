const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const requireCurrentHealthConsent = require("../middleware/requireCurrentHealthConsent");
const { replyToMessage } = require("../controllers/chatbotController");

const router = express.Router();

router.post("/", authMiddleware, requireRole("PATIENT"), requireCurrentHealthConsent, replyToMessage);

module.exports = router;
