const mongoose = require("mongoose");

const chatRateLimitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    windowStartedAt: { type: Date, required: true },
    count: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
);

chatRateLimitSchema.index({ userId: 1, windowStartedAt: 1 }, { unique: true });
chatRateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("ChatRateLimit", chatRateLimitSchema);
