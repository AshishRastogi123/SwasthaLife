import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    // 🔗 User reference (Auth completed already)
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
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    phone: {
      type: String,
    },

    // 📏 Body Metrics (optional)
    heightCm: {
      type: Number,
    },
    weightKg: {
      type: Number,
    },

    // ❤️ Vitals (optional but structured)
    vitals: {
      bp: {
        type: String, // "120/80"
      },
      pulse: {
        type: Number, // bpm
      },
      spo2: {
        type: Number, // %
      },
      bloodSugar: {
        type: Number,
      },
    },

    // 🧬 Lifestyle & History
    lifestyle: {
      type: String, // sedentary / active
    },
    familyHistory: {
      type: [String], // ["diabetes", "heart disease"]
    },
    allergies: {
      type: [String], // ["penicillin"]
    },

    // 🤒 Symptoms (important for ML)
    symptoms: {
      fever: Boolean,
      headache: Boolean,
      cough: Boolean,
      fatigue: Boolean,
      bodyPain: Boolean,
      soreThroat: Boolean,
      nausea: Boolean,
      other: {
        type: String,
      },
    },

    // 🤖 Prediction Output (future use)
    prediction: {
      disease: String,
      probability: Number,
      modelUsed: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Prediction", predictionSchema);
