const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { listDoctors, createDoctor } = require("../controllers/doctorController");

const router = express.Router();
router.get("/", listDoctors);
router.post("/", authMiddleware, requireRole("ADMIN"), createDoctor);

module.exports = router;
