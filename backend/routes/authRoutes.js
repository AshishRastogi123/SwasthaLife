const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const csrfProtection = require("../middleware/csrfProtection");
const parseRegistrationForm = require("../middleware/parseRegistrationForm");
const { getUploadMiddleware } = require("../services/doctorVerificationStorage");
const {
  validateSignup,
  validateLogin,
} = require("../middleware/validateAuth");

const router = express.Router();

// Signup
router.get("/csrf", (req, res) => {
  const csrfToken = csrfProtection.createToken();
  csrfProtection.setCsrfCookie(res, csrfToken);
  res.status(200).json({ csrfToken });
});
const uploadDoctorVerification = getUploadMiddleware();
router.post("/signup", (req, res, next) => {
  uploadDoctorVerification(req, res, (error) => {
    if (error) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 400 : error.statusCode || 400;
      return res.status(status).json({
        message: error.code === "LIMIT_FILE_SIZE"
          ? "The verification document must be no larger than 5 MB"
          : error.message,
      });
    }
    return next();
  });
}, parseRegistrationForm, validateSignup, signup);

// Login
router.post("/login", validateLogin, login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    data: {
      id: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      doctorVerificationStatus: req.user.doctorVerificationStatus,
    },
  });
});

module.exports = router;
