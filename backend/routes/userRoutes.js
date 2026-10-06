const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { listUsers, updateUserStatus } = require("../controllers/adminController");

const router = express.Router();
router.use(authMiddleware, requireRole("ADMIN"));
router.get("/", listUsers);
router.patch("/:id/status", updateUserStatus);

module.exports = router;
