const mongoose = require("mongoose");

const healthConsentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    consentStatus: { type: Boolean, required: true, default: false },
    consentTimestamp: { type: Date, required: true },
    consentVersion: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthConsent", healthConsentSchema);
