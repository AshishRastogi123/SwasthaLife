import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const DEFAULT_SYMPTOMS = [
  "Fever",
  "Headache",
  "Cough",
  "Fatigue",
  "Body Pain",
  "Sore Throat",
  "Nausea",
  "Other",
];

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
    symptoms: DEFAULT_SYMPTOMS.reduce((acc, s) => {
      acc[s] = { checked: false, details: "" };
      return acc;
    }, {}),
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleSymptom = (sym) => {
    setForm((p) => ({
      ...p,
      symptoms: {
        ...p.symptoms,
        [sym]: { ...p.symptoms[sym], checked: !p.symptoms[sym].checked },
      },
    }));
  };

  const setSymptomDetails = (sym, value) => {
    setForm((p) => ({
      ...p,
      symptoms: {
        ...p.symptoms,
        [sym]: { ...p.symptoms[sym], details: value },
      },
    }));
  };
  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) <= 0)
      errs.age = "Valid age is required";
    if (!form.gender) errs.gender = "Gender is required";

    const anySym = Object.values(form.symptoms).some((s) => s.checked);
    if (!anySym) errs.symptoms = "Choose at least one symptom";

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
      const el =
        document.querySelector(`[name="${firstKey}"]`) ||
        document.querySelector(".symptoms-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const closeModal = () => setShowModal(false);

  const buildPayload = () => {
    const symptomsObj = {};

    Object.entries(form.symptoms).forEach(([key, val]) => {
      symptomsObj[key.toLowerCase().replace(" ", "")] = val.checked;
    });

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
        bloodSugar: form.bloodSugar
          ? Number(form.bloodSugar)
          : undefined,
      },

      lifestyle: form.lifestyle || undefined,
      familyHistory: form.familyHistory
        ? form.familyHistory.split(",").map((s) => s.trim())
        : [],
      allergies: form.allergies
        ? form.allergies.split(",").map((s) => s.trim())
        : [],

      symptoms: symptomsObj,
    };
  };


  const payload = buildPayload();

  const confirmAndSend = async () => {
    try {
      const payload = buildPayload();

      const res = await fetch("http://localhost:3000/api/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include", // cookie JWT support
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Submission failed");
        return;
      }

      alert("Prediction data saved successfully ✅");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Server error while submitting data");
    }
  };


  return (
    <>
      <Navbar />
      {/* spacer to avoid navbar overlap */}
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
                    className={`form-control ${errors.firstName ? "is-invalid" : ""
                      }`}
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
                    className={`form-control ${errors.lastName ? "is-invalid" : ""
                      }`}
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
                    className={`form-select ${errors.gender ? "is-invalid" : ""
                      }`}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
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
                    value={form.phone}
                    onChange={handleFieldChange}
                    className="form-control"
                    placeholder="(000) 000-000"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Height (cm) - optional</label>
                  <input
                    name="height"
                    value={form.height}
                    onChange={handleFieldChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Weight (kg) - optional</label>
                  <input
                    name="weight"
                    value={form.weight}
                    onChange={handleFieldChange}
                    className="form-control"
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
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Pulse (bpm)</label>
                    <input
                      name="pulse"
                      value={form.pulse}
                      onChange={handleFieldChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">SpO₂ (%)</label>
                    <input
                      name="spo2"
                      value={form.spo2}
                      onChange={handleFieldChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Blood sugar (optional)</label>
                    <input
                      name="bloodSugar"
                      value={form.bloodSugar}
                      onChange={handleFieldChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle / Family / Allergies */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">Lifestyle (optional)</label>
                  <input
                    name="lifestyle"
                    value={form.lifestyle}
                    onChange={handleFieldChange}
                    className="form-control"
                    placeholder="e.g., sedentary / active"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Family History (optional)
                  </label>
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
                    placeholder="e.g., penicillin"
                  />
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-3 symptoms-section">
                <h6>
                  Symptoms <span className="text-danger">*</span>
                </h6>
                {errors.symptoms && (
                  <div className="text-danger mb-2">{errors.symptoms}</div>
                )}
                <div className="row">
                  {Object.keys(form.symptoms).map((sym) => {
                    const entry = form.symptoms[sym];
                    return (
                      <div key={sym} className="col-md-6 mb-2">
                        <div className="d-flex align-items-start gap-2">
                          <div className="form-check">
                            <input
                              id={`sym-${sym}`}
                              className="form-check-input"
                              type="checkbox"
                              checked={entry.checked}
                              onChange={() => toggleSymptom(sym)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`sym-${sym}`}
                              style={{ marginLeft: 8 }}
                            >
                              {sym}
                            </label>
                          </div>
                        </div>

                        {entry.checked && (
                          <div className="mt-2">
                            {sym === "Fever" ? (
                              <select
                                className="form-select"
                                value={entry.details}
                                onChange={(e) =>
                                  setSymptomDetails(sym, e.target.value)
                                }
                              >
                                <option value="">Select fever range</option>
                                <option value="mild">Mild</option>
                                <option value="moderate">Moderate</option>
                                <option value="high">High</option>
                              </select>
                            ) : sym === "Other" ? (
                              <input
                                className="form-control"
                                placeholder="Describe other symptom"
                                value={entry.details}
                                onChange={(e) =>
                                  setSymptomDetails(sym, e.target.value)
                                }
                              />
                            ) : (
                              <input
                                className="form-control"
                                placeholder={`Details for ${sym} (optional)`}
                                value={entry.details}
                                onChange={(e) =>
                                  setSymptomDetails(sym, e.target.value)
                                }
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Popup Modal (Table view) */}
        {showModal && (
          <div
            className="modal-backdrop"
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

              <div className="mt-3" style={{ maxHeight: "60vh", overflowY: "auto" }}>
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
                      <td>{payload.height || "-"}</td>
                    </tr>
                    <tr>
                      <th>Weight (kg)</th>
                      <td>{payload.weight || "-"}</td>
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
                      <td>{payload.familyHistory || "-"}</td>
                    </tr>
                    <tr>
                      <th>Allergies</th>
                      <td>{payload.allergies || "-"}</td>
                    </tr>

                    <tr>
                      <th>Symptoms</th>
                      <td>
                        {payload.symptoms ? (
                          <ul className="mb-0">
                            {Object.entries(payload.symptoms)
                              .filter(([_, v]) => v === true)
                              .map(([k]) => (
                                <li key={k}>{k}</li>
                              ))}
                          </ul>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button className="btn btn-success" onClick={confirmAndSend}>
                  Confirm & Send
                </button>
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