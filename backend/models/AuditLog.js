const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    actorRole: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "ADMIN", "UNKNOWN"],
      required: true,
      default: "UNKNOWN",
    },
    action: { type: String, required: true, index: true },
    resourceType: {
      type: String,
      enum: ["USER", "DOCTOR", "DEPARTMENT", "APPOINTMENT", "EMERGENCY", "ASSESSMENT", "API", "AUTH"],
      required: true,
    },
    resourceId: { type: String, default: null },
    timestamp: { type: Date, required: true, default: Date.now, index: true, immutable: true },
    context: {
      ip: { type: String, maxlength: 64 },
      userAgent: { type: String, maxlength: 500 },
      method: { type: String, maxlength: 10 },
      path: { type: String, maxlength: 500 },
    },
    success: { type: Boolean, required: true, default: true },
    failureReason: { type: String, maxlength: 80 },
    changes: {
      fromStatus: { type: String, maxlength: 40 },
      toStatus: { type: String, maxlength: 40 },
    },
  },
  { versionKey: false }
);

auditLogSchema.index({ timestamp: -1, action: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
