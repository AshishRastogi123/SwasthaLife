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
      enum: ["Prefer not to say", "Male", "Female", "Other"],
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

const doctorProfessionalProfileSchema = new mongoose.Schema(
  {
    registrationAuthority: { type: String, trim: true, maxlength: 160 },
    specialization: { type: String, trim: true, maxlength: 160 },
    qualification: { type: String, trim: true, maxlength: 300 },
    yearsOfExperience: { type: Number, min: 0, max: 80 },
    facilityName: { type: String, trim: true, maxlength: 200 },
    summary: { type: String, trim: true, maxlength: 2000 },
  },
  { _id: false }
);

const doctorVerificationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"],
      default: "NOT_SUBMITTED",
      index: true,
    },
    document: {
      storagePath: { type: String, select: false },
      originalName: { type: String, maxlength: 255 },
      mimeType: { type: String, enum: ["application/pdf", "image/jpeg", "image/png"] },
      sizeBytes: { type: Number, min: 1, max: 5 * 1024 * 1024 },
      uploadedAt: Date,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    reviewNote: { type: String, trim: true, maxlength: 1000 },
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
    professionalProfile: { type: doctorProfessionalProfileSchema, default: undefined },
    doctorVerification: { type: doctorVerificationSchema, default: () => ({}) },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
