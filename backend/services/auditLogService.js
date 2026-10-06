const AuditLog = require("../models/AuditLog");

const writeAuditLog = async ({
  req,
  actorUserId = req?.user?.userId || null,
  actorRole = req?.user?.role || "UNKNOWN",
  action,
  resourceType,
  resourceId = null,
  success = true,
  failureReason,
  changes,
}) => {
  const context = req
    ? {
        ip: req.ip,
        userAgent: req.get?.("user-agent")?.slice(0, 500),
        method: req.method,
        path: `${req.baseUrl || ""}${req.path || ""}`.slice(0, 500),
      }
    : undefined;

  try {
    await AuditLog.create({
      actorUserId,
      actorRole,
      action,
      resourceType,
      resourceId: resourceId?.toString() || null,
      success,
      ...(failureReason ? { failureReason } : {}),
      ...(changes ? { changes } : {}),
      ...(context ? { context } : {}),
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
};

module.exports = { writeAuditLog };
