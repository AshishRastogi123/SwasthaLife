const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { writeAuditLog } = require("../services/auditLogService");

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const userExist = await User.findOne({ email: normalizedEmail });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      await writeAuditLog({
        req,
        action: "auth.login.failure",
        resourceType: "AUTH",
        success: false,
        failureReason: "INVALID_CREDENTIALS",
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.isActive) {
      await writeAuditLog({
        req,
        actorUserId: user._id,
        actorRole: user.role,
        action: "auth.login.failure",
        resourceType: "AUTH",
        resourceId: user._id,
        success: false,
        failureReason: "ACCOUNT_INACTIVE",
      });
      return res.status(403).json({ message: "Account is inactive" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await writeAuditLog({
        req,
        actorUserId: user._id,
        actorRole: user.role,
        action: "auth.login.failure",
        resourceType: "AUTH",
        resourceId: user._id,
        success: false,
        failureReason: "INVALID_CREDENTIALS",
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    await writeAuditLog({
      req,
      actorUserId: user._id,
      actorRole: user.role,
      action: "auth.login.success",
      resourceType: "AUTH",
      resourceId: user._id,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  await writeAuditLog({
    req,
    action: "auth.logout",
    resourceType: "AUTH",
  });
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });
  res.status(200).json({ message: "Logout successful" });
};
