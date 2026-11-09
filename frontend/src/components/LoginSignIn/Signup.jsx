import { motion as Motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../api";
import "./AuthResponsive.css";

const calculateAge = (value) => {
  if (!value) return "";
  const birthDate = new Date(`${value}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) age -= 1;
  return age >= 0 ? age : "";
};

function Signup() {
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  const [data, setData] = useState({
    fullname: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    bloodGroup: "",
    bloodPressure: "",
    heartRate: "",
    bodyTemperature: "",
    smokingStatus: "",
    alcoholConsumption: "",
    physicalActivityLevel: "",
    existingDiseases: "",
    allergies: "",
    currentMedications: "",
    previousSurgeries: "",
    familyMedicalHistory: "",
    password: "",
    conPassword: "",
    role: "PATIENT",
    departmentId: "",
    licenseNumber: "",
  });

  const [error, setError] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const age = calculateAge(data.dob);

  useEffect(() => {
    if (data.role !== "DOCTOR") return undefined;

    const controller = new AbortController();
    const loadDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const result = await apiRequest("/api/departments", { signal: controller.signal });
        setDepartments(result.data || []);
        setError((previous) => ({ ...previous, departments: "" }));
      } catch (loadError) {
        if (loadError.name !== "AbortError" && !controller.signal.aborted) {
          setError((previous) => ({ ...previous, departments: loadError.message }));
        }
      } finally {
        if (!controller.signal.aborted) setLoadingDepartments(false);
      }
    };

    loadDepartments();
    return () => controller.abort();
  }, [data.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (values) => {
    const errs = {};
    if (!values.fullname.trim()) errs.fullname = "Full name is required";
    if (!values.email) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "Enter a valid email";
    }
    if (values.phone && !/^[0-9]{10}$/.test(values.phone)) {
      errs.phone = "Enter a valid 10-digit phone number";
    }
    if (values.dob) {
      const date = new Date(`${values.dob}T00:00:00`);
      if (Number.isNaN(date.getTime()) || date > new Date()) errs.dob = "Enter a valid date of birth.";
    }
    const numericRanges = {
      heightCm: [30, 300],
      weightKg: [1, 500],
      heartRate: [20, 300],
      bodyTemperature: [30, 45],
    };
    Object.entries(numericRanges).forEach(([field, [minimum, maximum]]) => {
      if (values[field] !== "" && (!Number.isFinite(Number(values[field])) || Number(values[field]) < minimum || Number(values[field]) > maximum)) {
        errs[field] = `Enter a value between ${minimum} and ${maximum}.`;
      }
    });
    if (values.bloodPressure && !/^\d{2,3}\s*\/\s*\d{2,3}$/.test(values.bloodPressure.trim())) {
      errs.bloodPressure = "Use systolic/diastolic format, for example 120/80.";
    }
    if (!values.password) {
      errs.password = "Password is required";
    } else if (values.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (!values.conPassword) {
      errs.conPassword = "Confirm Password is required";
    } else if (values.password !== values.conPassword) {
      errs.conPassword = "Passwords do not match";
    }
    if (values.role === "DOCTOR") {
      if (!values.departmentId) errs.departmentId = "Select a department";
      if (!values.licenseNumber.trim()) errs.licenseNumber = "License number is required";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    const errs = validate(data);
    setError(errs);
    if (Object.keys(errs).length === 0) {
      try {
        submittingRef.current = true;
        setSubmitting(true);
        await apiRequest("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({
            name: data.fullname,
            email: data.email,
            password: data.password,
            confirmPassword: data.conPassword,
            phone: data.phone,
            role: data.role,
            profile: {
              dateOfBirth: data.dob,
              gender: data.gender,
            },
            ...(data.role === "PATIENT" && {
              healthProfile: {
                heightCm: data.heightCm === "" ? null : Number(data.heightCm),
                weightKg: data.weightKg === "" ? null : Number(data.weightKg),
                bloodGroup: data.bloodGroup,
                bloodPressure: data.bloodPressure,
                heartRate: data.heartRate === "" ? null : Number(data.heartRate),
                bodyTemperature: data.bodyTemperature === "" ? null : Number(data.bodyTemperature),
                smokingStatus: data.smokingStatus,
                alcoholConsumption: data.alcoholConsumption,
                physicalActivityLevel: data.physicalActivityLevel,
              },
              medicalHistory: {
                existingDiseases: data.existingDiseases.split(",").map((value) => value.trim()).filter(Boolean),
                allergies: data.allergies.split(",").map((value) => value.trim()).filter(Boolean),
                currentMedications: data.currentMedications.split(",").map((value) => value.trim()).filter(Boolean),
                previousSurgeries: data.previousSurgeries.split(",").map((value) => value.trim()).filter(Boolean),
                familyMedicalHistory: data.familyMedicalHistory.split(",").map((value) => value.trim()).filter(Boolean),
              },
            }),
            ...(data.role === "DOCTOR" && {
              departmentId: data.departmentId,
              licenseNumber: data.licenseNumber,
            }),
          }),
        });
        toast.success("Account created. Please sign in.");
        navigate("/login", { replace: true });
      } catch (signupError) {
        setError((current) => ({ ...current, form: signupError.message || "Unable to create the account. Please try again." }));
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    }
  };

  // Reuse the animation variants from your Login page
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };

  const leftPanelVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, delay: 0.2 } }
  };

  const rightPanelVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, delay: 0.4 } }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Motion.div
      className="auth-page d-flex justify-content-center align-items-center"
      style={{ background: "linear-gradient(135deg, #E3F2FD, #FCE4EC)" }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container">
        <div className="row justify-content-center">
          <Motion.div
            className="auth-intro-panel col-12 col-lg-5 d-flex flex-column align-items-center justify-content-center text-center bg-white shadow rounded-start p-4"
            variants={leftPanelVariants}
            initial="hidden"
            animate="visible"
          >
            <Motion.h4
              className="fw-bold mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Join SwasthaLife
            </Motion.h4>
            <Motion.h2
              className="fw-bold text-primary mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Create your account
            </Motion.h2>
            <Motion.img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
              alt="health"
              style={{ width: "80%", maxWidth: "250px" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            />
            <Motion.a
              href="/"
              className="mt-3 text-decoration-none fw-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Home
            </Motion.a>
          </Motion.div>

          <Motion.div
            className="auth-form-panel col-12 col-lg-5 bg-light shadow rounded-end p-4"
            variants={rightPanelVariants}
            initial="hidden"
            animate="visible"
          >
            <Motion.h4
              className="text-center fw-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Create a new account
            </Motion.h4>

            <form onSubmit={handleSubmit}>
              {error.form && <div className="alert alert-danger" role="alert">{error.form}</div>}
              <Motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full name"
                  className="form-control"
                  value={data.fullname}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.fullname}</p>
              </Motion.div>

              <Motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 1 }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="form-control"
                  value={data.email}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.email}</p>
              </Motion.div>

              <Motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 1.2 }}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (optional)"
                  className="form-control"
                  value={data.phone}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.phone}</p>
              </Motion.div>

              <section className="border rounded-3 bg-white p-3 mb-3">
                <h5 className="fw-bold text-primary">Personal Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="signup-dob">Date of birth (optional)</label>
                    <input
                      id="signup-dob"
                      type="date"
                      name="dob"
                      max={new Date().toISOString().slice(0, 10)}
                      className={`form-control ${error.dob ? "is-invalid" : ""}`}
                      value={data.dob}
                      onChange={handleChange}
                    />
                    {error.dob && <div className="invalid-feedback">{error.dob}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="signup-age">Age</label>
                    <input id="signup-age" className="form-control" value={age} placeholder="Calculated from DOB" readOnly />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="signup-gender">Gender (optional)</label>
                    <select id="signup-gender" name="gender" className="form-select" value={data.gender} onChange={handleChange}>
                      <option value="">Prefer not to say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </section>

              <Motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 1.3 }}>
                <label className="form-label" htmlFor="signup-role">I am registering as</label>
                <select
                  id="signup-role"
                  name="role"
                  className="form-select"
                  value={data.role}
                  onChange={handleChange}
                >
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                </select>
              </Motion.div>

              {data.role === "DOCTOR" && (
                <>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="signup-department">Department</label>
                    <select
                      id="signup-department"
                      name="departmentId"
                      className="form-select"
                      value={data.departmentId}
                      onChange={handleChange}
                      disabled={loadingDepartments}
                    >
                      <option value="">
                        {loadingDepartments ? "Loading departments..." : "Select a department"}
                      </option>
                      {departments.map((department) => (
                        <option key={department._id} value={department._id}>{department.name}</option>
                      ))}
                    </select>
                    <p className="text-danger">{error.departmentId || error.departments}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="signup-license">Medical license number</label>
                    <input
                      id="signup-license"
                      type="text"
                      name="licenseNumber"
                      placeholder="Medical license number"
                      className="form-control"
                      value={data.licenseNumber}
                      onChange={handleChange}
                    />
                    <p className="text-danger">{error.licenseNumber}</p>
                  </div>
                </>
              )}

              {data.role === "PATIENT" && (
                <>
                  <section className="border rounded-3 bg-white p-3 mb-3">
                    <h5 className="fw-bold text-primary">Physical Information <small className="text-muted fw-normal">(optional)</small></h5>
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label" htmlFor="signup-height">Height (cm)</label>
                        <input id="signup-height" type="number" min="30" max="300" step="0.1" name="heightCm" value={data.heightCm} onChange={handleChange} className={`form-control ${error.heightCm ? "is-invalid" : ""}`} />
                        {error.heightCm && <div className="invalid-feedback">{error.heightCm}</div>}
                      </div>
                      <div className="col-md-3">
                        <label className="form-label" htmlFor="signup-weight">Weight (kg)</label>
                        <input id="signup-weight" type="number" min="1" max="500" step="0.1" name="weightKg" value={data.weightKg} onChange={handleChange} className={`form-control ${error.weightKg ? "is-invalid" : ""}`} />
                        {error.weightKg && <div className="invalid-feedback">{error.weightKg}</div>}
                      </div>
                      <div className="col-md-3">
                        <label className="form-label" htmlFor="signup-blood-group">Blood group</label>
                        <select id="signup-blood-group" name="bloodGroup" value={data.bloodGroup} onChange={handleChange} className="form-select">
                          <option value="">Not provided</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group} value={group}>{group}</option>)}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label" htmlFor="signup-bp">Blood pressure</label>
                        <input id="signup-bp" name="bloodPressure" value={data.bloodPressure} onChange={handleChange} className={`form-control ${error.bloodPressure ? "is-invalid" : ""}`} placeholder="120/80" />
                        {error.bloodPressure && <div className="invalid-feedback">{error.bloodPressure}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="signup-heart-rate">Heart rate (bpm)</label>
                        <input id="signup-heart-rate" type="number" min="20" max="300" name="heartRate" value={data.heartRate} onChange={handleChange} className={`form-control ${error.heartRate ? "is-invalid" : ""}`} />
                        {error.heartRate && <div className="invalid-feedback">{error.heartRate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="signup-temperature">Body temperature (°C)</label>
                        <input id="signup-temperature" type="number" min="30" max="45" step="0.1" name="bodyTemperature" value={data.bodyTemperature} onChange={handleChange} className={`form-control ${error.bodyTemperature ? "is-invalid" : ""}`} />
                        {error.bodyTemperature && <div className="invalid-feedback">{error.bodyTemperature}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="signup-smoking">Smoking status</label>
                        <select id="signup-smoking" name="smokingStatus" value={data.smokingStatus} onChange={handleChange} className="form-select">
                          <option value="">Not provided</option>
                          <option value="NEVER">Never</option>
                          <option value="FORMER">Former</option>
                          <option value="CURRENT">Current</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="signup-alcohol">Alcohol consumption</label>
                        <select id="signup-alcohol" name="alcoholConsumption" value={data.alcoholConsumption} onChange={handleChange} className="form-select">
                          <option value="">Not provided</option>
                          <option value="NONE">None</option>
                          <option value="OCCASIONAL">Occasional</option>
                          <option value="REGULAR">Regular</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="signup-activity">Physical activity level</label>
                        <select id="signup-activity" name="physicalActivityLevel" value={data.physicalActivityLevel} onChange={handleChange} className="form-select">
                          <option value="">Not provided</option>
                          <option value="SEDENTARY">Sedentary</option>
                          <option value="LOW">Low</option>
                          <option value="MODERATE">Moderate</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className="border rounded-3 bg-white p-3 mb-3">
                    <h5 className="fw-bold text-primary">Medical History <small className="text-muted fw-normal">(optional)</small></h5>
                    <p className="small text-muted">Separate multiple entries with commas. You can edit or remove these details later.</p>
                    <div className="row g-3">
                      {[
                        ["existingDiseases", "Existing diseases"],
                        ["allergies", "Allergies"],
                        ["currentMedications", "Current medications"],
                        ["previousSurgeries", "Previous surgeries"],
                        ["familyMedicalHistory", "Family medical history"],
                      ].map(([field, label]) => (
                        <div className="col-md-6" key={field}>
                          <label className="form-label" htmlFor={`signup-${field}`}>{label}</label>
                          <textarea id={`signup-${field}`} name={field} value={data[field]} onChange={handleChange} className="form-control" rows="2" maxLength="1000" />
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              <Motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 1.4 }}>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className="form-control"
                  value={data.password}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.password}</p>
              </Motion.div>

              <Motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 1.6 }}>
                <input
                  type="password"
                  name="conPassword"
                  placeholder="Confirm password"
                  className="form-control"
                  value={data.conPassword}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.conPassword}</p>
              </Motion.div>

              <Motion.div className="d-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.8 }}>
                <Motion.button className="btn btn-primary fw-semibold" type="submit" disabled={submitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {submitting ? "Creating account..." : "Sign up"}
                </Motion.button>
              </Motion.div>
              <p className="text-muted small mt-3">
                By signing up, you acknowledge our <Link to="/privacy">Privacy Policy</Link> and agree to our <Link to="/terms">Terms of Service</Link>.
              </p>
            </form>

            <Motion.hr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 2.0 }} />

            <Motion.p className="text-center text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 2.2 }}>
              Or continue with
            </Motion.p>

            <Motion.div className="d-flex justify-content-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 2.4 }}>
              <Motion.button className="btn btn-outline-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-facebook me-2"></i> Facebook
              </Motion.button>
              <Motion.button className="btn btn-outline-info" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-twitter me-2"></i> Twitter
              </Motion.button>
              <Motion.button className="btn btn-outline-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-linkedin me-2"></i> LinkedIn
              </Motion.button>
              <Motion.button className="btn btn-outline-danger" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-google me-2"></i> Google
              </Motion.button>
            </Motion.div>

            <Motion.div className="text-center mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 2.6 }}>
              <p>
                Already have an account?
                <Link to="/login" className="text-decoration-none ms-2">Login</Link>
              </p>
            </Motion.div>
          </Motion.div>
        </div>
      </div>
    </Motion.div>
  );
}

export default Signup;