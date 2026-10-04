const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },
    appointmentDate: { type: Date, required: true, index: true },
    appointmentTime: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"],
      default: "PENDING",
      index: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prediction",
    },
    clinicalNotes: { type: String, trim: true, maxlength: 5000 },
    reviewedAt: Date,
  },
  { timestamps: true }
);

appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["PENDING", "CONFIRMED", "COMPLETED", "NO_SHOW"] },
    },
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
