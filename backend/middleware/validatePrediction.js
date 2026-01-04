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

  if (
    !symptoms ||
    typeof symptoms !== "object" ||
    Object.values(symptoms).every((v) => v === false)
  ) {
    return res.status(400).json({
      message: "At least one symptom is required",
    });
  }

  next();
};

module.exports = validatePrediction;
