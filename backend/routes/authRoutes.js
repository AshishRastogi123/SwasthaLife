const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const csrfProtection = require("../middleware/csrfProtection");
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
router.post("/signup", validateSignup, signup);

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
    },
  });
});

module.exports = router;
