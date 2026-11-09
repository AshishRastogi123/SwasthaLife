const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getUploadMiddleware } = require("../services/doctorVerificationStorage");
const {
  listDoctors,
  createDoctor,
  getDoctorDashboardStats,
  updateDoctorSlot,
} = require("../controllers/doctorController");
const {
  getOwnVerificationDocument,
  replaceOwnVerificationDocument,
} = require("../controllers/doctorVerificationController");

const router = express.Router();
const uploadDoctorVerification = getUploadMiddleware();
const handleVerificationUpload = (req, res, next) => {
  uploadDoctorVerification(req, res, (error) => {
    if (error) {
      return res.status(error.code === "LIMIT_FILE_SIZE" ? 400 : error.statusCode || 400).json({
        message: error.code === "LIMIT_FILE_SIZE"
          ? "The verification document must be no larger than 5 MB"
          : error.message,
      });
    }
    return next();
  });
};
router.get("/", listDoctors);
router.get("/me/verification-document", authMiddleware, getOwnVerificationDocument);
router.put("/me/verification-document", authMiddleware, handleVerificationUpload, replaceOwnVerificationDocument);
router.get("/me/dashboard", authMiddleware, requireRole("DOCTOR"), getDoctorDashboardStats);
router.patch("/me/slots", authMiddleware, requireRole("DOCTOR"), updateDoctorSlot);
router.post("/", authMiddleware, requireRole("ADMIN"), createDoctor);

module.exports = router;
