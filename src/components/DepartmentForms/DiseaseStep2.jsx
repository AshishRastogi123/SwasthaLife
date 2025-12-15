// DiseaseStep2.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const DiseaseStep2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // receive diseaseName and basicData from step1
  const diseaseName = location.state?.diseaseName || "Selected Disease";
  const basicData = location.state?.basicData || {};

  // mapping: for each disease provide fields (name,label,type,required,options)
  const diseaseFields = {
    "Heart Attack": [
      { name: "chest_pain_duration", label: "Chest pain duration (minutes)", type: "number", required: true },
      { name: "radiating_pain", label: "Does pain radiate to arm/jaw? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "previous_heart_disease", label: "Previous heart disease history", type: "text", required: false },
    ],
    "Irregular Heartbeat": [
      { name: "palpitation_frequency", label: "Palpitation frequency (times/day)", type: "number", required: true },
      { name: "dizziness", label: "Do you feel dizziness? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "High Blood Pressure": [
      { name: "bp_readings", label: "Recent BP reading (e.g., 140/90)", type: "text", required: true },
      { name: "bp_medication", label: "On BP medicines? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],

    "Brain Tumor": [
      { name: "headache_pattern", label: "Headache pattern (describe)", type: "textarea", required: true },
      { name: "vision_changes", label: "Any vision changes? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "seizures", label: "Any seizures/fits? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "Stroke": [
      { name: "sudden_weakness", label: "Sudden one-sided weakness? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "speech_difficulty", label: "Speech difficulty now? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "Epilepsy": [
      { name: "last_seizure", label: "Last seizure occurred (days ago)", type: "number", required: true },
      { name: "on_antiepileptics", label: "On anti-seizure meds? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],

    "Lung Cancer": [
      { name: "smoking_years", label: "Smoking history (years)", type: "number", required: false },
      { name: "persistent_cough_duration", label: "Persistent cough duration (weeks)", type: "number", required: true },
      { name: "blood_in_sputum", label: "Blood in sputum? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "Breast Cancer": [
      { name: "breast_lump", label: "Breast lump noticed? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "family_breast_cancer", label: "Family history of breast cancer? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],
    "Colon Cancer": [
      { name: "blood_in_stool", label: "Blood in stool? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "change_bowel_habit", label: "Change in bowel habit? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],

    "Asthma": [
      { name: "wheeze_frequency", label: "Wheeze frequency (episodes/week)", type: "number", required: true },
      { name: "uses_inhaler", label: "Use inhaler? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "Pneumonia": [
      { name: "fever_days", label: "Fever duration (days)", type: "number", required: true },
      { name: "productive_cough", label: "Productive cough? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "TB (Tuberculosis)": [
      { name: "night_sweats", label: "Night sweats? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "weight_loss_tb", label: "Unintentional weight loss? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],

    "Ulcer": [
      { name: "burning_pain_after_food", label: "Burning/epigastric pain related to food? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "antacid_relief", label: "Relieved by antacids? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],
    "Hepatitis": [
      { name: "jaundice", label: "Yellowing of eyes/skin? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "alcohol_history", label: "Alcohol use history (years)", type: "number", required: false },
    ],
    "Gallstones": [
      { name: "colic_pain", label: "Biliary colic pain after fatty food? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],

    "Kidney Stones": [
      { name: "side_pain_severity", label: "Side pain severity (1-10)", type: "number", required: true },
      { name: "blood_in_urine", label: "Blood in urine? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "Kidney Damage": [
      { name: "reduced_urine", label: "Reduced urine output? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "edema", label: "Swelling in legs/face? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "UTI": [
      { name: "burning_urine", label: "Burning while urinating? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "fever_uti", label: "Fever present? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],

    "Acne": [
      { name: "acne_severity", label: "Acne severity (Mild/Moderate/Severe)", type: "select", options: ["Mild","Moderate","Severe"], required: true },
      { name: "scarring", label: "Scarring present? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],
    "Eczema": [
      { name: "itch_intensity", label: "Itch intensity (1-10)", type: "number", required: true },
      { name: "dry_patch_locations", label: "Where are dry patches? (short note)", type: "text", required: false },
    ],
    "Psoriasis": [
      { name: "plaque_locations", label: "Where are plaques located?", type: "text", required: true },
    ],

    "Arthritis": [
      { name: "joint_pain_duration", label: "Joint pain duration (months)", type: "number", required: true },
      { name: "morning_stiffness", label: "Morning stiffness? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "Osteoporosis": [
      { name: "fracture_history", label: "Previous fractures? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],
    "Bone Fracture": [
      { name: "fracture_location", label: "Fracture location (body part)", type: "text", required: true },
    ],

    "Diabetes": [
      { name: "hba1c", label: "Recent HbA1c (%)", type: "text", required: false },
      { name: "medication_diabetes", label: "On diabetes medication? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],
    "Thyroid Problem": [
      { name: "weight_change", label: "Recent weight change? (gain/loss)", type: "text", required: false },
      { name: "tsh_value", label: "Recent TSH (if known)", type: "text", required: false },
    ],
    "Adrenal Problem": [
      { name: "fatigue_level", label: "Fatigue level (1-10)", type: "number", required: true },
    ],

    "PCOS": [
      { name: "irregular_periods", label: "Irregular periods? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "hirsutism", label: "Excess hair growth? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],
    "Endometriosis": [
      { name: "pelvic_pain_severity", label: "Pelvic pain severity (1-10)", type: "number", required: true },
      { name: "infertility_issues", label: "Fertility problems? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],
    "Period Problems": [
      { name: "cycle_length", label: "Typical cycle length (days)", type: "number", required: true },
      { name: "heavy_bleeding", label: "Heavy bleeding during period? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],

    "Measles": [
      { name: "rash_duration", label: "Rash duration (days)", type: "number", required: true },
      { name: "vaccinated_measles", label: "Vaccinated for measles? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],
    "Chickenpox": [
      { name: "itch_level", label: "Itch level (1-10)", type: "number", required: true },
      { name: "vaccinated_chickenpox", label: "Vaccinated? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],
    "Mumps": [
      { name: "face_swelling", label: "Face/jaw swelling? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
    ],

    "Depression": [
      { name: "mood_days", label: "Feeling low for how many days?", type: "number", required: true },
      { name: "sleep_change", label: "Sleep pattern changed? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
    ],
    "Anxiety": [
      { name: "panic_attacks", label: "Panic attacks? (Yes/No)", type: "select", options: ["Yes","No"], required: false },
      { name: "worry_level", label: "Worry level (1-10)", type: "number", required: true },
    ],
    "Schizophrenia": [
      { name: "psychotic_symptoms", label: "Hearing voices / false beliefs? (Yes/No)", type: "select", options: ["Yes","No"], required: true },
      { name: "duration_psychosis", label: "Duration of symptoms (months)", type: "number", required: false },
    ],
  };

  // fields for this disease (fallback empty array)
  const fields = diseaseFields[diseaseName] || [];

  // local state to hold these disease-specific answers
  const initialSpecific = {};
  fields.forEach((f) => (initialSpecific[f.name] = ""));
  const [specificData, setSpecificData] = useState(initialSpecific);
  const [errors, setErrors] = useState({});

  // handle change
  const handleSpecificChange = (e) => {
    const { name, value } = e.target;
    setSpecificData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    // validate required fields
    fields.forEach((f) => {
      if (f.required && (!specificData[f.name] && specificData[f.name] !== 0)) {
        newErrors[f.name] = "This field is required.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Build final payload
    const payload = {
      disease: diseaseName,
      basicData,
      specificData,
      timestamp: new Date().toISOString(),
    };

    // since backend is not present, show alert + console
    console.log("Prediction payload:", payload);
    alert(
      `Submitted details for "${diseaseName}".\n\n(Currently You are well fine.)`
    );

    // optional - navigate to a 'result' page or back
    // navigate("/prediction-result", { state: { payload }});
  };

  const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      <Navbar />
      <div style={{ fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif" }}>
        <motion.section initial="hidden" whileInView="visible" variants={sectionVariants} transition={{ duration: 0.6 }} className="py-5" style={{ background: "linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)", color: "#1e293b", textAlign: "center", padding: "60px 20px", marginTop: "76px" }}>
          <div className="container">
            <h1 className="display-5 fw-bold" style={{ color: "#2563eb" }}>{diseaseName} — Detailed Questions</h1>
            <p style={{ color: "#374151" }} className="mt-2">Here we ask a few more questions specific to <strong>{diseaseName}</strong>. These help the prediction model.</p>

            {/* show small summary of basicData */}
            <div className="mt-4" style={{ maxWidth: 900, margin: "0 auto", textAlign: "left" }}>
              <div className="card shadow-sm border-0" style={{ borderRadius: 12 }}>
                <div className="card-body">
                  <h6 className="fw-bold" style={{ color: "#2563eb" }}>Basic Details (from previous Details)</h6>
                  <div style={{ color: "#374151", fontSize: "0.95rem" }}>
                    <div><strong>Name:</strong> {basicData.fullName || "-"}</div>
                    <div><strong>Age:</strong> {basicData.age || "-"}</div>
                    <div><strong>Gender:</strong> {basicData.gender || "-"}</div>
                    <div><strong>BMI:</strong> {basicData.bmi || "-"}</div>
                    <div><strong>BP:</strong> {basicData.bloodPressure || "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" variants={sectionVariants} transition={{ duration: 0.6, delay: 0.1 }} className="py-5" style={{ background: "#fff", padding: "40px 20px 80px 20px" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <form onSubmit={validateAndSubmit}>
                  <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                    <div className="card-body p-4 p-md-5">
                      <h4 className="mb-3" style={{ color: "#2563eb" }}>{diseaseName} — Please fill below</h4>

                      {fields.length === 0 && (
                        <div className="alert alert-info">No additional questions for this disease. You can submit basic details directly.</div>
                      )}

                      <div className="row">
                        {fields.map((f) => (
                          <div key={f.name} className="col-md-12 mb-3">
                            <label className="form-label fw-semibold">{f.label}{f.required ? " *" : ""}</label>

                            {f.type === "text" && (
                              <input type="text" name={f.name} value={specificData[f.name]} onChange={handleSpecificChange} className={`form-control ${errors[f.name] ? "is-invalid" : ""}`} />
                            )}

                            {f.type === "number" && (
                              <input type="number" name={f.name} value={specificData[f.name]} onChange={handleSpecificChange} className={`form-control ${errors[f.name] ? "is-invalid" : ""}`} />
                            )}

                            {f.type === "textarea" && (
                              <textarea name={f.name} value={specificData[f.name]} onChange={handleSpecificChange} className={`form-control ${errors[f.name] ? "is-invalid" : ""}`} rows="3" />
                            )}

                            {f.type === "select" && (
                              <select name={f.name} value={specificData[f.name]} onChange={handleSpecificChange} className={`form-control ${errors[f.name] ? "is-invalid" : ""}`}>
                                <option value="">Select</option>
                                {f.options && f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            )}

                            {errors[f.name] && <div className="invalid-feedback d-block">{errors[f.name]}</div>}
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-outline-secondary" style={{ borderRadius: 25 }} onClick={() => navigate(-1)}>← Back</button>
                        <button type="submit" className="btn" style={{ background: "#2563eb", color: "#fff", borderRadius: 25 }}>Submit</button>
                      </div>
                    </div>
                  </div>
                </form>

                <p className="text-center mt-3" style={{ color: "#6b7280" }}>
                  Note: This is a flow. on Submit we will send data to the prediction show results.
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

export default DiseaseStep2;