import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const DiseasePredictionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Disease name passed from previous page (fallback)
  const diseaseName = location.state?.diseaseName || "Selected Disease";

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    heightCm: "",
    weightKg: "",
    bmi: "",
    bloodPressure: "",
    bloodSugar: "",
    smoking: "",
    alcohol: "",
    physicalActivity: "",
    sleepHours: "",
    waterIntake: "",
    dietType: "",
  });

  const [errors, setErrors] = useState({});

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Auto-calc BMI whenever height or weight changes
  useEffect(() => {
    const h = parseFloat(formData.heightCm);
    const w = parseFloat(formData.weightKg);
    if (h > 0 && w > 0) {
      const hMeters = h / 100;
      const bmiVal = w / (hMeters * hMeters);
      setFormData((prev) => ({ ...prev, bmi: bmiVal.toFixed(1) }));
    } else {
      setFormData((prev) => ({ ...prev, bmi: "" }));
    }
  }, [formData.heightCm, formData.weightKg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // allow only numbers for numeric fields (basic)
    if (name === "age" && value && !/^\d*$/.test(value)) return;
    if ((name === "heightCm" || name === "weightKg" || name === "sleepHours") && value && !/^[0-9]*\.?[0-9]*$/.test(value)) return;
    if ((name === "waterIntake") && value && !/^[0-9]*\.?[0-9]*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear field error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.age || parseInt(formData.age, 10) <= 0) newErrors.age = "Valid age is required.";
    if (!formData.gender) newErrors.gender = "Please select gender.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";
    if (!formData.heightCm || parseFloat(formData.heightCm) <= 0) newErrors.heightCm = "Height is required.";
    if (!formData.weightKg || parseFloat(formData.weightKg) <= 0) newErrors.weightKg = "Weight is required.";
    if (!formData.bloodPressure.trim()) newErrors.bloodPressure = "Please enter blood pressure (e.g., 120/80).";
    if (!formData.bloodSugar.trim()) newErrors.bloodSugar = "Please enter blood sugar level.";
    if (!formData.smoking) newErrors.smoking = "Please select smoking habit.";
    if (!formData.alcohol) newErrors.alcohol = "Please select alcohol habit.";
    if (!formData.physicalActivity) newErrors.physicalActivity = "Please select physical activity level.";
    if (!formData.sleepHours) newErrors.sleepHours = "Please enter sleep duration (hours).";
    if (!formData.waterIntake) newErrors.waterIntake = "Please enter water intake (liters).";
    if (!formData.dietType) newErrors.dietType = "Please select a diet type.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Prepare payload to send to step2 (or backend later)
    const basicData = { ...formData };

    // Navigate to step 2, pass diseaseName + basicData
    navigate("DiseaseStep2", { state: { diseaseName, basicData } });
  };

  return (
    <>
      <Navbar />

      <div style={{ fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif" }}>
        {/* Hero / Heading */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)",
            color: "#1e293b",
            textAlign: "center",
            padding: "80px 20px",
            marginTop: "76px",
          }}
        >
          <div className="container">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="display-5 fw-bold mb-3"
              style={{ color: "#2563eb" }}
            >
              Disease Prediction — Basic Details
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead mb-1"
              style={{ fontSize: "1.05rem", color: "#374151" }}
            >
              You are checking for:
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="fw-bold"
              style={{ fontSize: "1.3rem", color: "#111827", marginTop: "5px" }}
            >
              {diseaseName}
            </motion.p>
            <p style={{ fontSize: "0.9rem", color: "#4b5563", marginTop: "10px" }}>
              Fill these basic details honestly. Click Next to continue to disease-specific questions.
            </p>
          </div>
        </motion.section>

        {/* Form Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{ background: "#ffffff", padding: "40px 20px 60px 20px" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <div className="card border-0 shadow-sm" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-4 p-md-5">
                    <h2 className="h4 fw-bold mb-3 text-center" style={{ color: "#2563eb" }}>
                      Personal & Basic Health Details
                    </h2>
                    <p className="text-center mb-4" style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                      These details help the prediction model give more accurate results (sample / demo).
                    </p>

                    <form onSubmit={handleNext}>
                      <div className="row">
                        {/* Full Name */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                            placeholder="Your full name"
                          />
                          {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                        </div>

                        {/* Age */}
                        <div className="col-md-3 mb-3">
                          <label className="form-label fw-semibold">Age (years)</label>
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className={`form-control ${errors.age ? "is-invalid" : ""}`}
                            placeholder="e.g., 32"
                            min="1"
                            max="120"
                          />
                          {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                        </div>

                        {/* Gender */}
                        <div className="col-md-3 mb-3">
                          <label className="form-label fw-semibold">Gender</label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={`form-control ${errors.gender ? "is-invalid" : ""}`}
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                        </div>

                        {/* DOB */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Date of Birth</label>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                          />
                          {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                        </div>

                        {/* Mobile (optional) */}
                        <div className="col-md-3 mb-3">
                          <label className="form-label fw-semibold">Mobile (optional)</label>
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g., 9876543210"
                          />
                        </div>

                        {/* Email (optional) */}
                        <div className="col-md-3 mb-3">
                          <label className="form-label fw-semibold">Email (optional)</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="you@example.com"
                          />
                        </div>

                        {/* Height */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold">Height (cm)</label>
                          <input
                            type="number"
                            name="heightCm"
                            value={formData.heightCm}
                            onChange={handleChange}
                            className={`form-control ${errors.heightCm ? "is-invalid" : ""}`}
                            placeholder="e.g., 170"
                            min="30"
                            max="300"
                            step="0.1"
                          />
                          {errors.heightCm && <div className="invalid-feedback">{errors.heightCm}</div>}
                        </div>

                        {/* Weight */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold">Weight (kg)</label>
                          <input
                            type="number"
                            name="weightKg"
                            value={formData.weightKg}
                            onChange={handleChange}
                            className={`form-control ${errors.weightKg ? "is-invalid" : ""}`}
                            placeholder="e.g., 65"
                            min="1"
                            max="500"
                            step="0.1"
                          />
                          {errors.weightKg && <div className="invalid-feedback">{errors.weightKg}</div>}
                        </div>

                        {/* BMI (auto) */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold">BMI (auto)</label>
                          <input
                            type="text"
                            name="bmi"
                            value={formData.bmi}
                            readOnly
                            className="form-control"
                            placeholder="BMI will calculate"
                          />
                        </div>

                        {/* Blood Pressure */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Blood Pressure (e.g., 120/80)</label>
                          <input
                            type="text"
                            name="bloodPressure"
                            value={formData.bloodPressure}
                            onChange={handleChange}
                            className={`form-control ${errors.bloodPressure ? "is-invalid" : ""}`}
                            placeholder="e.g., 120/80"
                          />
                          {errors.bloodPressure && <div className="invalid-feedback">{errors.bloodPressure}</div>}
                        </div>

                        {/* Blood Sugar */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Blood Sugar Level</label>
                          <input
                            type="text"
                            name="bloodSugar"
                            value={formData.bloodSugar}
                            onChange={handleChange}
                            className={`form-control ${errors.bloodSugar ? "is-invalid" : ""}`}
                            placeholder="e.g., 95 mg/dL (fasting) or 140 mg/dL (pp)"
                          />
                          {errors.bloodSugar && <div className="invalid-feedback">{errors.bloodSugar}</div>}
                        </div>

                        {/* Smoking */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold">Smoking Habit</label>
                          <select
                            name="smoking"
                            value={formData.smoking}
                            onChange={handleChange}
                            className={`form-control ${errors.smoking ? "is-invalid" : ""}`}
                          >
                            <option value="">Select</option>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                            <option value="Former">Former</option>
                          </select>
                          {errors.smoking && <div className="invalid-feedback">{errors.smoking}</div>}
                        </div>

                        {/* Alcohol */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold">Alcohol Consumption</label>
                          <select
                            name="alcohol"
                            value={formData.alcohol}
                            onChange={handleChange}
                            className={`form-control ${errors.alcohol ? "is-invalid" : ""}`}
                          >
                            <option value="">Select</option>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                          {errors.alcohol && <div className="invalid-feedback">{errors.alcohol}</div>}
                        </div>

                        {/* Physical Activity */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold">Daily Physical Activity Level</label>
                          <select
                            name="physicalActivity"
                            value={formData.physicalActivity}
                            onChange={handleChange}
                            className={`form-control ${errors.physicalActivity ? "is-invalid" : ""}`}
                          >
                            <option value="">Select</option>
                            <option value="None">None</option>
                            <option value="Low">Low (light walking)</option>
                            <option value="Moderate">Moderate (30 min/day)</option>
                            <option value="High">High (intense exercise)</option>
                          </select>
                          {errors.physicalActivity && <div className="invalid-feedback">{errors.physicalActivity}</div>}
                        </div>

                        {/* Sleep Hours */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold">Sleep Duration (hours/day)</label>
                          <input
                            type="number"
                            name="sleepHours"
                            value={formData.sleepHours}
                            onChange={handleChange}
                            className={`form-control ${errors.sleepHours ? "is-invalid" : ""}`}
                            min="0"
                            max="24"
                            step="0.1"
                            placeholder="e.g., 7.5"
                          />
                          {errors.sleepHours && <div className="invalid-feedback">{errors.sleepHours}</div>}
                        </div>

                        {/* Water Intake */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold">Water Intake (liters/day)</label>
                          <input
                            type="number"
                            name="waterIntake"
                            value={formData.waterIntake}
                            onChange={handleChange}
                            className={`form-control ${errors.waterIntake ? "is-invalid" : ""}`}
                            min="0"
                            max="10"
                            step="0.1"
                            placeholder="e.g., 2.5"
                          />
                          {errors.waterIntake && <div className="invalid-feedback">{errors.waterIntake}</div>}
                        </div>

                        {/* Diet Type */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-semibold">Diet Type</label>
                          <select
                            name="dietType"
                            value={formData.dietType}
                            onChange={handleChange}
                            className={`form-control ${errors.dietType ? "is-invalid" : ""}`}
                          >
                            <option value="">Select</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Veg">Non-Veg</option>
                            <option value="Mixed">Mixed</option>
                          </select>
                          {errors.dietType && <div className="invalid-feedback">{errors.dietType}</div>}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="d-flex justify-content-between mt-3">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          style={{ borderRadius: "25px", padding: "8px 20px" }}
                          onClick={() => navigate(-1)}
                        >
                          ← Back
                        </button>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          className="btn"
                          style={{
                            background: "#2563eb",
                            color: "#ffffff",
                            borderRadius: "25px",
                            padding: "8px 24px",
                            fontWeight: "bold",
                          }}
                        >
                          Next
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </div>

                <p className="text-center mt-3" style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  <strong>Note:</strong> This is a Basic Details form. After Next, disease-specific questions will appear.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </>
  );
};

export default DiseasePredictionForm;