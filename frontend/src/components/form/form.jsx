import React, { useState, useMemo } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

// Categorized symptoms for better organization
const SYMPTOM_CATEGORIES = {
  general: {
    name: "General Symptoms",
    symptoms: [
      "fatigue", "weight_gain", "weight_loss", "fever", "chills", "sweating", 
      "weakness", "lethargy", "restlessness", "mood_swings", "anxiety", "depression"
    ]
  },
  respiratory: {
    name: "Respiratory Symptoms",
    symptoms: [
      "cough", "continuous_sneezing", "breathlessness", "congestion", "runny_nose",
      "sinus_pressure", "phlegm", "blood_in_sputum", "rusty_sputum", "mucoid_sputum"
    ]
  },
  gastrointestinal: {
    name: "Gastrointestinal Symptoms",
    symptoms: [
      "stomach_pain", "abdominal_pain", "nausea", "vomiting", "diarrhoea", "constipation",
      "indigestion", "acidity", "loss_of_appetite", "burning_micturition", "spotting_urination"
    ]
  },
  neurological: {
    name: "Neurological Symptoms",
    symptoms: [
      "headache", "dizziness", "loss_of_balance", "unsteadiness", "slurred_speech",
      "altered_sensorium", "coma", "loss_of_smell", "visual_disturbances", "lack_of_concentration"
    ]
  },
  musculoskeletal: {
    name: "Musculoskeletal Symptoms",
    symptoms: [
      "joint_pain", "muscle_pain", "muscle_weakness", "back_pain", "neck_pain", "stiff_neck",
      "knee_pain", "hip_joint_pain", "painful_walking", "movement_stiffness", "swelling_joints"
    ]
  },
  dermatological: {
    name: "Skin & Dermatological Symptoms",
    symptoms: [
      "itching", "skin_rash", "nodal_skin_eruptions", "skin_peeling", "blister", 
      "yellow_crust_ooze", "red_spots_over_body", "dischromic_patches", "pus_filled_pimples",
      "blackheads", "scurring", "silver_like_dusting", "inflammatory_nails"
    ]
  },
  cardiovascular: {
    name: "Cardiovascular Symptoms",
    symptoms: [
      "chest_pain", "fast_heart_rate", "palpitations", "cold_hands_and_feets", 
      "swollen_blood_vessels", "prominent_veins_on_calf"
    ]
  },
  sensory: {
    name: "Sensory Symptoms",
    symptoms: [
      "blurred_and_distorted_vision", "watering_from_eyes", "redness_of_eyes", 
      "throat_irritation", "patches_in_throat", "foul_smell_of_urine"
    ]
  }
};

// Symptom labels mapping
const SYMPTOM_LABELS = {
  // General
  fatigue: "Fatigue / Tiredness",
  weight_gain: "Weight Gain",
  weight_loss: "Weight Loss",
  fever: "Fever",
  chills: "Chills",
  sweating: "Sweating",
  weakness: "Weakness",
  lethargy: "Lethargy",
  restlessness: "Restlessness",
  mood_swings: "Mood Swings",
  anxiety: "Anxiety",
  depression: "Depression",
  
  // Respiratory
  cough: "Cough",
  continuous_sneezing: "Continuous Sneezing",
  breathlessness: "Shortness of Breath",
  congestion: "Nasal Congestion",
  runny_nose: "Runny Nose",
  sinus_pressure: "Sinus Pressure",
  phlegm: "Phlegm / Mucus",
  blood_in_sputum: "Blood in Sputum",
  rusty_sputum: "Rusty Sputum",
  mucoid_sputum: "Mucoid Sputum",
  
  // Gastrointestinal
  stomach_pain: "Stomach Pain",
  abdominal_pain: "Abdominal Pain",
  nausea: "Nausea",
  vomiting: "Vomiting",
  diarrhoea: "Diarrhea",
  constipation: "Constipation",
  indigestion: "Indigestion",
  acidity: "Acidity / Heartburn",
  loss_of_appetite: "Loss of Appetite",
  burning_micturition: "Burning Urination",
  spotting_urination: "Spotting Urination",
  
  // Neurological
  headache: "Headache",
  dizziness: "Dizziness",
  loss_of_balance: "Loss of Balance",
  unsteadiness: "Unsteadiness",
  slurred_speech: "Slurred Speech",
  altered_sensorium: "Altered Sensorium",
  coma: "Coma / Unconsciousness",
  loss_of_smell: "Loss of Smell",
  visual_disturbances: "Visual Disturbances",
  lack_of_concentration: "Lack of Concentration",
  
  // Musculoskeletal
  joint_pain: "Joint Pain",
  muscle_pain: "Muscle Pain",
  muscle_weakness: "Muscle Weakness",
  back_pain: "Back Pain",
  neck_pain: "Neck Pain",
  stiff_neck: "Stiff Neck",
  knee_pain: "Knee Pain",
  hip_joint_pain: "Hip Joint Pain",
  painful_walking: "Painful Walking",
  movement_stiffness: "Movement Stiffness",
  swelling_joints: "Swelling Joints",
  
  // Dermatological
  itching: "Itching",
  skin_rash: "Skin Rash",
  nodal_skin_eruptions: "Skin Nodules/Eruptions",
  skin_peeling: "Skin Peeling",
  blister: "Blisters",
  yellow_crust_ooze: "Yellow Crust Formation",
  red_spots_over_body: "Red Spots on Body",
  dischromic_patches: "Discolored Patches",
  pus_filled_pimples: "Pus-filled Pimples",
  blackheads: "Blackheads",
  scurring: "Scarring",
  silver_like_dusting: "Silver-like Dusting",
  inflammatory_nails: "Inflamed Nails",
  
  // Cardiovascular
  chest_pain: "Chest Pain",
  fast_heart_rate: "Fast Heart Rate",
  palpitations: "Palpitations",
  cold_hands_and_feets: "Cold Hands and Feet",
  swollen_blood_vessels: "Swollen Blood Vessels",
  prominent_veins_on_calf: "Prominent Veins on Calf",
  
  // Sensory
  blurred_and_distorted_vision: "Blurred Vision",
  watering_from_eyes: "Watery Eyes",
  redness_of_eyes: "Red Eyes",
  throat_irritation: "Throat Irritation",
  patches_in_throat: "Patches in Throat",
  foul_smell_of_urine: "Foul Smell of Urine"
};

// Flatten all symptoms into one array for the select component
const ALL_SYMPTOMS = Object.values(SYMPTOM_CATEGORIES).flatMap(category => category.symptoms);

// Create options for react-select
const SYMPTOM_OPTIONS = ALL_SYMPTOMS.map(symptom => ({
  value: symptom,
  label: SYMPTOM_LABELS[symptom] || symptom.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
  category: Object.keys(SYMPTOM_CATEGORIES).find(key => 
    SYMPTOM_CATEGORIES[key].symptoms.includes(symptom)
  )
}));

// Group options by category
const groupedOptions = Object.entries(SYMPTOM_CATEGORIES).map(([key, category]) => ({
  label: category.name,
  options: SYMPTOM_OPTIONS.filter(opt => opt.category === key)
}));

const SymptomForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    dob: "",
    phone: "",
    height: "",
    weight: "",
    bp: "",
    pulse: "",
    spo2: "",
    bloodSugar: "",
    lifestyle: "",
    familyHistory: "",
    allergies: "",
    symptoms: [],
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  // Prediction & save states
  const [predicting, setPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSymptomChange = (selected) => {
    setForm((prev) => ({ 
      ...prev, 
      symptoms: selected ? selected.map((s) => s.value) : [] 
    }));
  };

  // No separate search input anymore; use react-select's built-in search
  const filteredOptions = groupedOptions; // kept name for compatibility with existing code

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) <= 0)
      errs.age = "Valid age is required";
    if (!form.gender) errs.gender = "Gender is required";
    if (!form.symptoms || form.symptoms.length === 0) 
      errs.symptoms = "Please select at least one symptom";
    else if (form.symptoms.length > 10)
      errs.symptoms = "Maximum 10 symptoms allowed";
    
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      setShowModal(true);
    } else {
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector(`[name="${firstKey}"]`) ||
                  document.querySelector(".symptoms-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const closeModal = () => setShowModal(false);

  const buildPayload = () => {
    return {
      firstName: form.firstName,
      lastName: form.lastName,
      age: Number(form.age),
      dob: form.dob || undefined,
      gender: form.gender,
      phone: form.phone || undefined,
      heightCm: form.height ? Number(form.height) : undefined,
      weightKg: form.weight ? Number(form.weight) : undefined,
      vitals: {
        bp: form.bp || undefined,
        pulse: form.pulse ? Number(form.pulse) : undefined,
        spo2: form.spo2 ? Number(form.spo2) : undefined,
        bloodSugar: form.bloodSugar ? Number(form.bloodSugar) : undefined,
      },
      lifestyle: form.lifestyle || undefined,
      familyHistory: form.familyHistory ? 
        form.familyHistory.split(",").map((s) => s.trim()).filter(s => s) : [],
      allergies: form.allergies ? 
        form.allergies.split(",").map((s) => s.trim()).filter(s => s) : [],
      symptoms: form.symptoms,
    };
  };

  const payload = buildPayload();

  const confirmAndSend = async () => {
    try {
      setPredicting(true);
      setPredictionResult(null);
      setSaveStatus(null);

      const payload = buildPayload();
      // Use VITE_API_URL when available (dev) otherwise default to localhost backend
      const base = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : 'http://localhost:3000';

      const colsUrl = base ? `${String(base).replace(/\/$/, '')}/api/predict/columns` : '/api/predict/columns';
      const colsRes = await fetch(colsUrl);
      if (!colsRes.ok) {
        const text = await colsRes.text();
        setPredicting(false);
        setSaveStatus({ ok: false, message: `Could not fetch symptom columns: ${text || colsRes.statusText}` });
        return;
      }
      const colsJson = await colsRes.json();
      const columns = colsJson.columns || [];

      // Build full binary input vector (1 = selected, 0 = not selected)
      const selectedSet = new Set(payload.symptoms || []);
      const input_vector = columns.map((c) => selectedSet.has(c) ? 1 : 0);

      const url = base ? `${String(base).replace(/\/$/, '')}/api/predict?debug=1` : '/api/predict?debug=1';

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_vector }),
      });

      // Parse response safely (handle empty/non-JSON bodies)
      let data = null;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }
      } else {
        const text = await res.text();
        try {
          data = text ? JSON.parse(text) : null;
        } catch (e) {
          data = null;
        }
      }

      setPredicting(false);

      if (!res.ok) {
        const message = (data && (data.detail || data.message)) || res.statusText || `Request failed with status ${res.status}`;
        setPredictionResult(null);
        setSaveStatus({ ok: false, message });
        return;
      }

      if (!data) {
        setPredictionResult(null);
        setSaveStatus({ ok: false, message: 'Invalid response from prediction service' });
        return;
      }

      // Optionally show input_vector for verification (returned from ML when debug enabled)
      if (data.input_vector) {
        console.debug('ML returned input_vector (debug):', data.input_vector);
      }

      // Show prediction in modal instead of alert
      setPredictionResult({ disease: data.predicted_disease, confidence: data.confidence });
      setSaveStatus({ ok: true, message: 'Prediction ready — save to patient records if needed.' });

    } catch (err) {
      console.error(err);
      setPredicting(false);
      setSaveStatus({ ok: false, message: err.message || 'Server error while requesting prediction' });
    }
  };

  const saveToRecords = async () => {
    try {
      setSaving(true);
      setSaveStatus(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setSaveStatus({ ok: false, message: 'Login required to save patient record' });
        setSaving(false);
        return;
      }

      const body = { ...buildPayload() };
      if (predictionResult) {
        body.prediction = {
          disease: predictionResult.disease,
          probability: predictionResult.confidence || null,
          modelUsed: 'FastAPI-ML',
        };
      }

      const res = await fetch('/api/prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      // Safely parse response (handle empty/non-JSON)
      let data = null;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try { data = await res.json(); } catch (e) { data = null; }
      } else {
        const text = await res.text();
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
      }

      setSaving(false);
      if (!res.ok) {
        setSaveStatus({ ok: false, message: (data && data.message) || 'Failed to save record' });
        return;
      }

      setSaveStatus({ ok: true, message: 'Patient record saved successfully' });
    } catch (err) {
      console.error(err);
      setSaving(false);
      setSaveStatus({ ok: false, message: 'Server error while saving record' });
    }
  };

  const selectedSymptomObjects = SYMPTOM_OPTIONS.filter((opt) => 
    form.symptoms.includes(opt.value)
  );

  return (
    <>
      <Navbar />
      <div style={{ height: "76px" }} />

      <div className="container my-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="mb-3">Medical / Disease Prediction Form</h4>
            <form onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleFieldChange}
                    className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleFieldChange}
                    className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>
              </div>

              {/* Age / DOB / Gender */}
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label className="form-label">
                    Age <span className="text-danger">*</span>
                  </label>
                  <input
                    name="age"
                    type="number"
                    min="0"
                    max="120"
                    value={form.age}
                    onChange={handleFieldChange}
                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                  />
                  {errors.age && (
                    <div className="invalid-feedback">{errors.age}</div>
                  )}
                </div>

                <div className="col-md-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleFieldChange}
                    className="form-control"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleFieldChange}
                    className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <div className="invalid-feedback">{errors.gender}</div>
                  )}
                </div>
              </div>

              {/* Phone / Height / Weight */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">Phone (optional)</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleFieldChange}
                    className="form-control"
                    placeholder="(000) 000-0000"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Height (cm) - optional</label>
                  <input
                    name="height"
                    type="number"
                    min="50"
                    max="250"
                    value={form.height}
                    onChange={handleFieldChange}
                    className="form-control"
                    placeholder="e.g., 170"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Weight (kg) - optional</label>
                  <input
                    name="weight"
                    type="number"
                    min="20"
                    max="300"
                    value={form.weight}
                    onChange={handleFieldChange}
                    className="form-control"
                    placeholder="e.g., 70"
                  />
                </div>
              </div>

              {/* Vitals */}
              <div className="mb-3">
                <h6>Vitals (optional)</h6>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">BP (e.g. 120/80)</label>
                    <input
                      name="bp"
                      value={form.bp}
                      onChange={handleFieldChange}
                      className="form-control"
                      placeholder="SYS/DIA"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Pulse (bpm)</label>
                    <input
                      name="pulse"
                      type="number"
                      min="30"
                      max="200"
                      value={form.pulse}
                      onChange={handleFieldChange}
                      className="form-control"
                      placeholder="60-100"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">SpO₂ (%)</label>
                    <input
                      name="spo2"
                      type="number"
                      min="70"
                      max="100"
                      value={form.spo2}
                      onChange={handleFieldChange}
                      className="form-control"
                      placeholder="95-100"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Blood sugar (mg/dL)</label>
                    <input
                      name="bloodSugar"
                      type="number"
                      min="50"
                      max="500"
                      value={form.bloodSugar}
                      onChange={handleFieldChange}
                      className="form-control"
                      placeholder="70-140"
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle / Family / Allergies */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">Lifestyle (optional)</label>
                  <select
                    name="lifestyle"
                    value={form.lifestyle}
                    onChange={handleFieldChange}
                    className="form-select"
                  >
                    <option value="">Select</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="moderately_active">Moderately Active</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Family History (optional)</label>
                  <input
                    name="familyHistory"
                    value={form.familyHistory}
                    onChange={handleFieldChange}
                    className="form-control"
                    placeholder="e.g., diabetes, heart disease"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Allergies (optional)</label>
                  <input
                    name="allergies"
                    value={form.allergies}
                    onChange={handleFieldChange}
                    className="form-control"
                    placeholder="e.g., penicillin, peanuts"
                  />
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-4 symptoms-section">
                <h6>
                  Symptoms <span className="text-danger">*</span>
                  <small className="text-muted ms-2">
                    (Select 1-10 symptoms)
                  </small>
                </h6>
                
                {errors.symptoms && (
                  <div className="alert alert-danger py-2 mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors.symptoms}
                  </div>
                )}
                
                <Select
                  isMulti
                  name="symptoms"
                  options={filteredOptions}
                  value={selectedSymptomObjects}
                  onChange={handleSymptomChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Search and select symptoms..."
                  isSearchable={true}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  maxMenuHeight={300}
                  formatGroupLabel={data => (
                    <div className="fw-bold text-primary">
                      {data.label}
                    </div>
                  )}
                />
                
                {form.symptoms.length > 0 && (
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        Selected: {form.symptoms.length} symptom(s)
                      </small>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setForm(prev => ({ ...prev, symptoms: [] }))}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedSymptomObjects.map(symptom => (
                        <span key={symptom.value} className="badge bg-primary-subtle text-primary border border-primary-subtle p-2">
                          {symptom.label}
                          <button
                            type="button"
                            className="btn-close btn-close-sm ms-2"
                            onClick={() => {
                              const newSymptoms = form.symptoms.filter(s => s !== symptom.value);
                              setForm(prev => ({ ...prev, symptoms: newSymptoms }));
                            }}
                            style={{ fontSize: '0.5rem' }}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setForm({
                    firstName: "", lastName: "", age: "", gender: "", dob: "",
                    phone: "", height: "", weight: "", bp: "", pulse: "",
                    spo2: "", bloodSugar: "", lifestyle: "", familyHistory: "",
                    allergies: "", symptoms: []
                  })}
                >
                  Reset Form
                </button>
                <button type="submit" className="btn btn-primary px-4">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Popup Modal */}
        {showModal && (
          <div
            className="fade show"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
            }}
            onClick={closeModal}
          >
            <div
              className="card p-4"
              style={{ width: "95%", maxWidth: 900 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="mb-0">Submitted Data Summary</h5>
                <button
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>

              <div className="mt-3" style={{ maxHeight: "52vh", overflowY: "auto" }}>
                <table className="table table-bordered">
                  <tbody>
                    <tr> 
                      <th style={{ width: 220 }}>Name</th>
                      <td>{form.firstName} {form.lastName}</td>
                    </tr>
                    
                    <tr>
                      <th>Age</th>
                      <td>{payload.age || "-"}</td>
                    </tr>
                    <tr>
                      <th>Gender</th>
                      <td>{payload.gender || "-"}</td>
                    </tr>
                    <tr>
                      <th>Date of Birth</th>
                      <td>{payload.dob || "-"}</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{payload.phone || "-"}</td>
                    </tr>
                    <tr>
                      <th>Height (cm)</th>
                      <td>{payload.heightCm || "-"}</td>
                    </tr>
                    <tr>
                      <th>Weight (kg)</th>
                      <td>{payload.weightKg || "-"}</td>
                    </tr>

                    <tr>
                      <th>Vitals</th>
                      <td>
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th style={{ width: 200 }}>BP</th>
                              <td>{payload.vitals.bp || "-"}</td>
                            </tr>
                            <tr>
                              <th>Pulse (bpm)</th>
                              <td>{payload.vitals.pulse || "-"}</td>
                            </tr>
                            <tr>
                              <th>SpO₂ (%)</th>
                              <td>{payload.vitals.spo2 || "-"}</td>
                            </tr>
                            <tr>
                              <th>Blood Sugar</th>
                              <td>{payload.vitals.bloodSugar || "-"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <th>Lifestyle</th>
                      <td>{payload.lifestyle || "-"}</td>
                    </tr>
                    <tr>
                      <th>Family History</th>
                      <td>
                        {payload.familyHistory.length > 0 ? (
                          <ul className="mb-0 ps-3">
                            {payload.familyHistory.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : "-"}
                      </td>
                    </tr>
                    <tr>
                      <th>Allergies</th>
                      <td>
                        {payload.allergies.length > 0 ? (
                          <ul className="mb-0 ps-3">
                            {payload.allergies.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : "-"}
                      </td>
                    </tr>

                    <tr>
                      <th>Symptoms ({payload.symptoms.length})</th>
                      <td>
                        {payload.symptoms.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1">
                            {selectedSymptomObjects.map((symptom) => (
                              <span key={symptom.value} className="badge bg-info text-dark p-2">
                                {symptom.label}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>

                  </tbody>
                </table>

                {/* Prediction result */}
                {predictionResult && (
                  <div className="mt-3">
                    <div className="card border-primary shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title mb-1">Prediction Result</h6>
                        <p className="mb-1"><strong>Disease:</strong> {predictionResult.disease}</p>
                        <p className="mb-0"><strong>Confidence:</strong> {predictionResult.confidence ? (predictionResult.confidence * 100).toFixed(2) + '%' : 'N/A'}</p>
                        <small className="text-muted d-block mt-2">You can save this prediction to the patient's record.</small>
                      </div>
                    </div>
                  </div>
                )}

                {saveStatus && (
                  <div className={`mt-3 alert ${saveStatus.ok ? 'alert-success' : 'alert-danger'}`}>
                    {saveStatus.message}
                  </div>
                )}

              </div>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>

                {!predictionResult ? (
                  <button className="btn btn-primary" onClick={confirmAndSend} disabled={predicting}>
                    {predicting ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    Predict Disease
                  </button>
                ) : (
                  <>
                    <button className="btn btn-outline-primary" onClick={() => { setPredictionResult(null); setSaveStatus(null); }} disabled={predicting}>Predict Again</button>
                    <button className="btn btn-success" onClick={saveToRecords} disabled={saving}>
                      {saving ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : null}
                      Save to Records
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SymptomForm;