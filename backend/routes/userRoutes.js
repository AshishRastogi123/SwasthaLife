const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { listUsers, createUser, updateUserStatus } = require("../controllers/adminController");
const {
  getCurrentUser,
  updateProfile,
  updateHealthProfile,
  updateMedicalHistory,
} = require("../controllers/userProfileController");

const router = express.Router();
router.get("/profile", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.put("/health-profile", authMiddleware, updateHealthProfile);
router.put("/medical-history", authMiddleware, updateMedicalHistory);

router.use(authMiddleware, requireRole("ADMIN"));
router.get("/", listUsers);
router.post("/", createUser);
router.patch("/:id/status", updateUserStatus);

module.exports = router;
