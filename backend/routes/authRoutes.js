const express = require("express");
const { signup, login } = require("../controllers/authController");
const {
  validateSignup,
  validateLogin,
} = require("../middleware/validateAuth");

const router = express.Router();

// Signup
router.post("/signup", validateSignup, signup);

// Login
router.post("/login", validateLogin, login);

module.exports = router;
