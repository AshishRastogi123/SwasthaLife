const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getPatientHistory } = require("../controllers/historyController");

const router = express.Router();
router.use(authMiddleware);
router.get("/mine", requireRole("PATIENT"), getPatientHistory);
router.get("/patient/:patientId", requireRole("DOCTOR", "ADMIN", "PATIENT"), getPatientHistory);

module.exports = router;
