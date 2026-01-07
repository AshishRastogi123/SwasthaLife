const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    // 🔗 User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🧍 Personal Details
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    dob: Date,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    phone: String,

    // 📏 Body Metrics
    heightCm: Number,
    weightKg: Number,

    // ❤️ Vitals
    vitals: {
      bp: String,
      pulse: Number,
      spo2: Number,
      bloodSugar: Number,
    },

    // 🧬 Lifestyle & History
    lifestyle: String,
    familyHistory: [String],
    allergies: [String],

    // 🤒 Symptoms: store as an array of ML symptom keys (e.g., ['cough','fever'])
    symptoms: {
      type: [String],
      default: [],
    },

    // 🤖 Prediction Output
    prediction: {
      disease: String,
      probability: Number,
      modelUsed: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
