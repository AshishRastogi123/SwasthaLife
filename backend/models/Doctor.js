const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    licenseNumber: { type: String, required: true, unique: true, trim: true },
    qualifications: [{ type: String, trim: true }],
    bio: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    availableSlots: {
      type: [{
        type: String,
        trim: true,
        match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      }],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
