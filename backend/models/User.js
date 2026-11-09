const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    dateOfBirth: {
      type: Date,
      validate: {
        validator: (value) => !value || value <= new Date(),
        message: "Date of birth cannot be in the future",
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
  },
  { _id: false }
);

const healthProfileSchema = new mongoose.Schema(
  {
    heightCm: { type: Number, min: 30, max: 300 },
    weightKg: { type: Number, min: 1, max: 500 },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    bloodPressure: {
      type: String,
      trim: true,
      match: [/^\d{2,3}\s*\/\s*\d{2,3}$/, "Blood pressure must be in systolic/diastolic format"],
    },
    heartRate: { type: Number, min: 20, max: 300 },
    bodyTemperature: { type: Number, min: 30, max: 45 },
    smokingStatus: { type: String, enum: ["NEVER", "FORMER", "CURRENT"] },
    alcoholConsumption: { type: String, enum: ["NONE", "OCCASIONAL", "REGULAR"] },
    physicalActivityLevel: { type: String, enum: ["SEDENTARY", "LOW", "MODERATE", "HIGH"] },
  },
  { _id: false }
);

const medicalHistorySchema = new mongoose.Schema(
  {
    existingDiseases: { type: [{ type: String, trim: true, maxlength: 200 }], default: [] },
    allergies: { type: [{ type: String, trim: true, maxlength: 200 }], default: [] },
    currentMedications: { type: [{ type: String, trim: true, maxlength: 200 }], default: [] },
    previousSurgeries: { type: [{ type: String, trim: true, maxlength: 200 }], default: [] },
    familyMedicalHistory: { type: [{ type: String, trim: true, maxlength: 200 }], default: [] },
  },
  { _id: false }
);

const listLimit = (path) => ({
  validator: (values) => values.length <= 50,
  message: `${path} cannot contain more than 50 entries`,
});

for (const path of [
  "existingDiseases",
  "allergies",
  "currentMedications",
  "previousSurgeries",
  "familyMedicalHistory",
]) {
  medicalHistorySchema.path(path).validate(listLimit(path));
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "ADMIN"],
      default: "PATIENT",
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    profile: { type: profileSchema, default: () => ({}) },
    healthProfile: { type: healthProfileSchema, default: () => ({}) },
    medicalHistory: { type: medicalHistorySchema, default: () => ({}) },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
