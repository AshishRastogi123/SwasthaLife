const Prediction = require("../models/Prediction");

const createPrediction = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      firstName,
      lastName,
      age,
      dob,
      gender,
      phone,
      heightCm,
      weightKg,
      vitals,
      lifestyle,
      familyHistory,
      allergies,
      symptoms,
    } = req.body;

    const prediction = await Prediction.create({
      userId,
      firstName,
      lastName,
      age,
      dob,
      gender,
      phone,
      heightCm,
      weightKg,
      vitals,
      lifestyle,
      familyHistory,
      allergies,
      symptoms,
    });

    return res.status(201).json({
      message: "Prediction data saved successfully",
      data: prediction,
    });
  } catch (error) {
    console.error("Prediction save error:", error);
    return res.status(500).json({
      message: "Server error while saving prediction",
    });
  }
};

module.exports = { createPrediction };
