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
  next();
};

module.exports = requireRole;
