const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  listPatientPredictions,
  getPrediction,
  reviewPrediction,
} = require("../controllers/predictionController");

const router = express.Router();
router.use(authMiddleware);
router.get("/mine", requireRole("PATIENT"), listPatientPredictions);
router.get("/:id", requireRole("PATIENT", "DOCTOR", "ADMIN"), getPrediction);
router.patch("/:id/review", requireRole("DOCTOR", "ADMIN"), reviewPrediction);

module.exports = router;
