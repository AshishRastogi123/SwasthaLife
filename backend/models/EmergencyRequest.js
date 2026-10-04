const mongoose = require("mongoose");

const emergencyRequestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    symptoms: { type: String, required: true, trim: true, maxlength: 2000 },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
    },
    status: {
      type: String,
      enum: ["NEW", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED", "CANCELLED"],
      default: "NEW",
      index: true,
    },
    acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acknowledgedAt: Date,
    resolvedAt: Date,
    resolutionNotes: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmergencyRequest", emergencyRequestSchema);
