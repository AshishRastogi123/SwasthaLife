const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateSignup,
  validateLogin,
} = require("../middleware/validateAuth");

const router = express.Router();

// Signup
router.post("/signup", validateSignup, signup);

// Login
router.post("/login", validateLogin, login);
router.post("/logout", authMiddleware, logout);

module.exports = router;
