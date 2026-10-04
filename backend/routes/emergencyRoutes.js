const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { validateEmergency } = require("../middleware/validateDomains");
const {
  createEmergencyRequest,
  listPatientEmergencyRequests,
  listOperationalEmergencyRequests,
  updateEmergencyStatus,
} = require("../controllers/emergencyController");

const router = express.Router();
router.use(authMiddleware);
router.post("/", requireRole("PATIENT"), validateEmergency, createEmergencyRequest);
router.get("/mine", requireRole("PATIENT"), listPatientEmergencyRequests);
router.get("/", requireRole("DOCTOR", "ADMIN"), listOperationalEmergencyRequests);
router.patch("/:id/status", requireRole("DOCTOR", "ADMIN"), updateEmergencyStatus);

module.exports = router;
