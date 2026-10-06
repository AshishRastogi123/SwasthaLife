const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getHealthConsent, setHealthConsent } = require("../controllers/healthConsentController");

const router = express.Router();
router.use(authMiddleware, requireRole("PATIENT"));
router.get("/health", getHealthConsent);
router.put("/health", setHealthConsent);

module.exports = router;
