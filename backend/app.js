const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const historyRoutes = require("./routes/historyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const healthConsentRoutes = require("./routes/healthConsentRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("API running ✅");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", predictionRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/consent", healthConsentRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled API error:", err);
  if (res.headersSent) return next(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation failed", details: err.errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with this value already exists" });
  }
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  });
}
