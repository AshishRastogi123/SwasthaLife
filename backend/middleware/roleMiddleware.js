const { writeAuditLog } = require("../services/auditLogService");

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    void writeAuditLog({
      req,
      action: "security.unauthorized",
      resourceType: "API",
      success: false,
      failureReason: "INSUFFICIENT_ROLE",
    });
    return res.status(403).json({ message: "Forbidden" });
  }
  if (req.user.role === "DOCTOR" && req.user.doctorVerificationStatus !== "APPROVED") {
    void writeAuditLog({
      req,
      action: "security.unauthorized",
      resourceType: "API",
      success: false,
      failureReason: "DOCTOR_VERIFICATION_REQUIRED",
    });
    return res.status(403).json({
      message: "Doctor verification must be approved before using this feature",
      verificationStatus: req.user.doctorVerificationStatus,
    });
  }
  next();
};

module.exports = requireRole;
