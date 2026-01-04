const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const validatePrediction = require("../middleware/validatePrediction");
const { createPrediction } = require("../controllers/predictionController");

const router = express.Router();

// POST /api/prediction
router.post(
  "/prediction",
  authMiddleware,
  validatePrediction,
  createPrediction
);

module.exports = router;
