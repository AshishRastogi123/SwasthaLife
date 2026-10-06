const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const requireCurrentHealthConsent = require("../middleware/requireCurrentHealthConsent");
const { validateAppointment } = require("../middleware/validateDomains");
const {
  createAppointment,
  listPatientAppointments,
  listDoctorAppointments,
  listAllAppointments,
  listAvailableSlots,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const router = express.Router();
router.use(authMiddleware);
router.post("/", requireRole("PATIENT"), requireCurrentHealthConsent, validateAppointment, createAppointment);
router.get("/mine", requireRole("PATIENT"), listPatientAppointments);
router.get("/assigned", requireRole("DOCTOR"), listDoctorAppointments);
router.get("/available", requireRole("PATIENT"), listAvailableSlots);
router.get("/", requireRole("ADMIN"), listAllAppointments);
router.patch("/:id/status", requireRole("PATIENT", "DOCTOR", "ADMIN"), updateAppointmentStatus);

module.exports = router;
