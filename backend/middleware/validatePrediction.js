const validatePrediction = (req, res, next) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    symptoms,
  } = req.body;

  if (!firstName || !lastName || !age || !gender) {
    return res.status(400).json({
      message: "Required fields missing",
    });
  }

  // Accept either an array of symptom keys or an object of booleans
  if (!symptoms) {
    return res.status(400).json({ message: "At least one symptom is required" });
  }

  if (Array.isArray(symptoms)) {
    if (symptoms.length === 0) {
      return res.status(400).json({ message: "At least one symptom is required" });
    }
  } else if (typeof symptoms === "object") {
    if (Object.values(symptoms).every((v) => v === false)) {
      return res.status(400).json({ message: "At least one symptom is required" });
    }
  } else {
    return res.status(400).json({ message: "Invalid symptoms format" });
  }

  next();
};

module.exports = validatePrediction;
