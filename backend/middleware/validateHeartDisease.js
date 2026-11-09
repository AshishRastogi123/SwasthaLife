const FIELD_RULES = {
  age: { min: 1, max: 120, integer: true },
  sex: { values: [0, 1] },
  cp: { values: [0, 1, 2, 3] },
  trestbps: { min: 50, max: 250 },
  chol: { min: 100, max: 700 },
  fbs: { values: [0, 1] },
  restecg: { values: [0, 1, 2] },
  thalach: { min: 50, max: 250, integer: true },
  exang: { values: [0, 1] },
  oldpeak: { min: -3, max: 10 },
  slope: { values: [0, 1, 2] },
  ca: { min: 0, max: 4, integer: true, optional: true },
  thal: { values: [0, 1, 2, 3], optional: true },
};

const validateHeartDisease = (req, res, next) => {
  const input = req.body;

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return res.status(400).json({ message: "Heart health inputs must be provided as an object." });
  }

  for (const [field, rule] of Object.entries(FIELD_RULES)) {
    const value = input[field];
    if (rule.optional && (value === undefined || value === null || value === "")) continue;
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return res.status(400).json({ message: `${field} must be a finite number.` });
    }
    if (rule.integer && !Number.isInteger(value)) {
      return res.status(400).json({ message: `${field} must be a whole number.` });
    }
    if (rule.values && !rule.values.includes(value)) {
      return res.status(400).json({ message: `${field} must be one of ${rule.values.join(", ")}.` });
    }
    if (rule.min !== undefined && value < rule.min) {
      return res.status(400).json({ message: `${field} must be at least ${rule.min}.` });
    }
    if (rule.max !== undefined && value > rule.max) {
      return res.status(400).json({ message: `${field} must be at most ${rule.max}.` });
    }
  }

  next();
};

module.exports = validateHeartDisease;
