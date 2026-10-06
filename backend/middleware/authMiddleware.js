const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { writeAuditLog } = require("../services/auditLogService");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      await writeAuditLog({
        req,
        action: "security.unauthorized",
        resourceType: "API",
        success: false,
        failureReason: "MISSING_CREDENTIALS",
      });
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id email role isActive");
    if (!user || !user.isActive) {
      await writeAuditLog({
        req,
        actorUserId: user?._id || decoded.userId,
        actorRole: user?.role || "UNKNOWN",
        action: "security.unauthorized",
        resourceType: "API",
        success: false,
        failureReason: "ACCOUNT_UNAVAILABLE",
      });
      return res.status(401).json({ message: "Unauthorized: Account unavailable" });
    }
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      await writeAuditLog({
        req,
        action: "security.unauthorized",
        resourceType: "API",
        success: false,
        failureReason: "INVALID_CREDENTIALS",
      });
    }
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
};

module.exports = authMiddleware;
