const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id email role isActive");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized: Account unavailable" });
    }
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
};

module.exports = authMiddleware;
