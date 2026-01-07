const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const validatePrediction = require("../middleware/validatePrediction");
const { createPrediction } = require("../controllers/predictionController");

const router = express.Router();

// POST /api/prediction (save - requires auth)
router.post(
  "/prediction",
  authMiddleware,
  validatePrediction,
  createPrediction
);

// POST /api/predict (quick prediction - no auth required)
router.post(
  "/predict",
  // light input validation (symptoms or input_vector required)
  (req, res, next) => {
    const { symptoms, input_vector } = req.body;
    if (!symptoms && !input_vector) return res.status(400).json({ message: 'At least one symptom or input_vector is required' });
    next();
  },
  // controller returns ML-only prediction
  (req, res, next) => require('../controllers/predictionController').predictOnly(req, res, next)
);

// GET /api/predict/columns (no auth) - returns canonical symptom feature list
router.get(
  "/predict/columns",
  (req, res, next) => require('../controllers/predictionController').getColumns(req, res, next)
);

module.exports = router;
