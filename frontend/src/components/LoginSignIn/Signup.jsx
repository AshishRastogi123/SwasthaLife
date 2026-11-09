import { AnimatePresence, motion as Motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../../api";
import "./AuthResponsive.css";
import "./SignupWizard.css";

const STEPS = [
  "Personal Information",
  "Physical / Professional Information",
  "Medical History",
  "Account Security",
];
const MEDICAL_FIELDS = [
  ["existingDiseases", "Existing diseases", "e.g. asthma, hypertension"],
  ["allergies", "Allergies", "e.g. pollen, penicillin"],
  ["currentMedications", "Current medications", "e.g. medicine name and dosage"],
  ["previousSurgeries", "Previous surgeries", "e.g. procedure and approximate year"],
  ["familyMedicalHistory", "Family medical history", "e.g. diabetes (parent), heart disease (sibling)"],
];
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const calculateAge = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) age -= 1;
  return age >= 0 ? age : "";
};

const createInitialData = () => ({
  name: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  role: "",
  departmentId: "",
  heightCm: "",
  weightKg: "",
  bloodGroup: "",
  smokingStatus: "",
  alcoholConsumption: "",
  physicalActivityLevel: "",
  medicalHistory: Object.fromEntries(MEDICAL_FIELDS.map(([field]) => [field, []])),
  medicalDrafts: Object.fromEntries(MEDICAL_FIELDS.map(([field]) => [field, ""])),
  professionalSummary: "",
  licenseNumber: "",
  registrationAuthority: "",
  specialization: "",
  qualification: "",
  yearsOfExperience: "",
  facilityName: "",
  verificationDocument: null,
  password: "",
  confirmPassword: "",
});

const passwordStrength = (password) => {
  if (!password) return { score: 0, label: "Not entered" };
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  return {
    score,
    label: ["Very weak", "Weak", "Fair", "Good", "Strong"][score],
  };
};

function FieldError({ children }) {
  return children ? <div className="invalid-feedback d-block">{children}</div> : null;
}

function RegistrationProgress({ step, onStepClick }) {
  return (
    <ol className="signup-progress">
      {STEPS.map((title, index) => {
        const number = index + 1;
        const complete = number < step;
        return (
          <li className={`signup-progress-step${number === step ? " is-current" : ""}${complete ? " is-complete" : ""}`} key={title}>
            <button type="button" onClick={() => number < step && onStepClick(number)} disabled={number >= step} aria-current={number === step ? "step" : undefined}>
              <span className="signup-progress-marker" aria-hidden="true">{complete ? "✓" : number}</span>
              <span className="signup-progress-title">{title}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function MedicalHistoryTags({ field, label, placeholder, values, draft, error, onDraftChange, onAdd, onRemove }) {
  const addEntries = () => onAdd(field);
  return (
    <div className="col-md-6">
      <label className="form-label fw-semibold" htmlFor={`medical-${field}`}>{label} <span className="text-muted fw-normal">(optional)</span></label>
      <div className="d-flex gap-2">
        <input
          id={`medical-${field}`}
          className={`form-control${error ? " is-invalid" : ""}`}
          value={draft}
          placeholder={placeholder}
          onChange={(event) => onDraftChange(field, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addEntries();
            }
          }}
          onBlur={addEntries}
          aria-describedby={`medical-help-${field}`}
        />
        <button type="button" className="btn btn-outline-primary" onClick={addEntries}>Add</button>
      </div>
      <small id={`medical-help-${field}`} className="form-text text-muted">Type an entry and press Enter, comma, or Add.</small>
      <FieldError>{error}</FieldError>
      {values.length > 0 && (
        <ul className="signup-tags" aria-label={`${label} entries`}>
          {values.map((entry, index) => (
            <li key={`${entry}-${index}`}>
              <span>{entry}</span>
              <button type="button" aria-label={`Remove ${entry}`} onClick={() => onRemove(field, index)}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const submittingRef = useRef(false);
  const [data, setData] = useState(createInitialData);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const age = useMemo(() => calculateAge(data.dateOfBirth), [data.dateOfBirth]);
  const previewUrl = useMemo(
    () => data.verificationDocument ? URL.createObjectURL(data.verificationDocument) : "",
    [data.verificationDocument]
  );
  const strength = passwordStrength(data.password);

  useEffect(() => {
    if (data.role !== "DOCTOR") return undefined;
    const controller = new AbortController();
    const loadDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const result = await apiRequest("/api/departments", { signal: controller.signal });
        setDepartments(result.data || []);
        setErrors((previous) => ({ ...previous, departments: "" }));
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) {
          setErrors((previous) => ({ ...previous, departments: error.message }));
        }
      } finally {
        if (!controller.signal.aborted) setLoadingDepartments(false);
      }
    };
    loadDepartments();
    return () => controller.abort();
  }, [data.role]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const update = (name, value) => {
    setData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const addMedicalEntries = (field) => {
    const entries = data.medicalDrafts[field].split(",").map((entry) => entry.trim()).filter(Boolean);
    if (!entries.length) return;
    setData((current) => ({
      ...current,
      medicalHistory: {
        ...current.medicalHistory,
        [field]: [...new Set([...current.medicalHistory[field], ...entries])],
      },
      medicalDrafts: { ...current.medicalDrafts, [field]: "" },
    }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const removeMedicalEntry = (field, index) => {
    setData((current) => ({
      ...current,
      medicalHistory: {
        ...current.medicalHistory,
        [field]: current.medicalHistory[field].filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  };

  const validateStep = (currentStep) => {
    const nextErrors = {};
    if (currentStep === 1) {
      if (!data.name.trim()) nextErrors.name = "Full name is required.";
      else if (data.name.trim().length > 120) nextErrors.name = "Full name must be 120 characters or fewer.";
      if (!data.email.trim()) nextErrors.email = "Email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) nextErrors.email = "Enter a valid email address.";
      if (data.dateOfBirth) {
        const date = new Date(`${data.dateOfBirth}T00:00:00`);
        if (Number.isNaN(date.getTime()) || date > new Date()) nextErrors.dateOfBirth = "Date of birth cannot be in the future.";
      }
      if (!["PATIENT", "DOCTOR"].includes(data.role)) nextErrors.role = "Select whether you are registering as a patient or doctor.";
    }

    if (currentStep === 2) {
      if (data.role === "DOCTOR") {
        if (!data.departmentId) nextErrors.departmentId = "Select a medical department.";
        if (!data.licenseNumber.trim()) nextErrors.licenseNumber = "Medical license or registration number is required.";
        else if (data.licenseNumber.trim().length > 100) nextErrors.licenseNumber = "License number must be 100 characters or fewer.";
        if (!data.verificationDocument) nextErrors.verificationDocument = "Upload your license or registration certificate.";
        else if (!ACCEPTED_DOCUMENT_TYPES.includes(data.verificationDocument.type)) {
          nextErrors.verificationDocument = "Choose a PDF, JPG, JPEG, or PNG file.";
        } else if (data.verificationDocument.size > MAX_DOCUMENT_SIZE) {
          nextErrors.verificationDocument = "Document must be 5 MB or smaller.";
        }
        if (data.yearsOfExperience !== "" && (!Number.isInteger(Number(data.yearsOfExperience)) || Number(data.yearsOfExperience) < 0 || Number(data.yearsOfExperience) > 80)) {
          nextErrors.yearsOfExperience = "Enter a whole number from 0 to 80.";
        }
      } else {
        const ranges = { heightCm: [30, 300], weightKg: [1, 500] };
        Object.entries(ranges).forEach(([field, [minimum, maximum]]) => {
          if (data[field] !== "" && (!Number.isFinite(Number(data[field])) || Number(data[field]) < minimum || Number(data[field]) > maximum)) {
            nextErrors[field] = `Enter a value between ${minimum} and ${maximum}.`;
          }
        });
      }
    }

    if (currentStep === 3 && data.role === "PATIENT") {
      for (const [field, value] of Object.entries(data.medicalDrafts)) {
        if (value.split(",").some((entry) => entry.trim().length > 200)) {
          nextErrors[field] = "Each entry must be 200 characters or fewer.";
        }
      }
    }

    if (currentStep === 4) {
      if (!data.password) nextErrors.password = "Password is required.";
      else if (data.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
      if (!data.confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
      else if (data.password !== data.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const continueStep = (event) => {
    event.preventDefault();
    if (!validateStep(step)) return;
    if (step < 4) setStep((current) => current + 1);
  };

  const handleDocumentChange = (event) => {
    const file = event.target.files?.[0] || null;
    event.target.value = "";
    update("verificationDocument", file);
    if (file && !ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
      setErrors((current) => ({ ...current, verificationDocument: "Choose a PDF, JPG, JPEG, or PNG file." }));
    } else if (file && file.size > MAX_DOCUMENT_SIZE) {
      setErrors((current) => ({ ...current, verificationDocument: "Document must be 5 MB or smaller." }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (step !== 4 || submittingRef.current || !validateStep(4)) return;
    submittingRef.current = true;
    setSubmitting(true);

    const registrationData = {
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      profile: {
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      },
      password: data.password,
      confirmPassword: data.confirmPassword,
      ...(data.role === "PATIENT" && {
        healthProfile: {
          heightCm: data.heightCm === "" ? null : Number(data.heightCm),
          weightKg: data.weightKg === "" ? null : Number(data.weightKg),
          bloodGroup: data.bloodGroup,
          smokingStatus: data.smokingStatus,
          alcoholConsumption: data.alcoholConsumption,
          physicalActivityLevel: data.physicalActivityLevel,
        },
        medicalHistory: data.medicalHistory,
      }),
      ...(data.role === "DOCTOR" && {
        departmentId: data.departmentId,
        licenseNumber: data.licenseNumber.trim(),
        professionalProfile: {
          registrationAuthority: data.registrationAuthority.trim(),
          specialization: data.specialization.trim(),
          qualification: data.qualification.trim(),
          yearsOfExperience: data.yearsOfExperience === "" ? null : Number(data.yearsOfExperience),
          facilityName: data.facilityName.trim(),
          summary: data.professionalSummary.trim(),
        },
      }),
    };

    const body = new FormData();
    body.append("registrationData", JSON.stringify(registrationData));
    if (data.role === "DOCTOR") body.append("verificationDocument", data.verificationDocument);

    try {
      const result = await apiRequest("/api/auth/signup", { method: "POST", body });
      setData(createInitialData());
      toast.success(data.role === "DOCTOR"
        ? "Account created. Your doctor application is pending verification."
        : "Account created. Please sign in.");
      navigate("/login", { replace: true, state: { registrationMessage: result.message } });
    } catch (signupError) {
      setErrors((current) => ({
        ...current,
        form: signupError.message || "Unable to create the account. Please try again.",
      }));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <main className="signup-wizard-page">
      <div className="signup-wizard-shell">
        <header className="signup-wizard-heading">
          <Link to="/" className="signup-brand">Swastha<span>Life</span></Link>
          <p className="signup-eyebrow">YOUR HEALTH JOURNEY STARTS HERE</p>
          <h1>Create your account</h1>
          <p>Set up your SwasthaLife account in a few simple steps.</p>
        </header>

        <section className="signup-wizard-card" aria-label="Registration">
          <RegistrationProgress step={step} onStepClick={(target) => setStep(target)} />

          <form onSubmit={step === 4 ? handleSubmit : continueStep} noValidate>
            {errors.form && <div className="alert alert-danger" role="alert">{errors.form}</div>}
            <AnimatePresence mode="wait" initial={false}>
              <Motion.section
                key={step}
                className="signup-step-content"
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.18 }}
                aria-labelledby="signup-step-title"
              >
                <p className="signup-step-count">STEP {step} OF 4</p>
                <h2 id="signup-step-title">{STEPS[step - 1]}</h2>

                {step === 1 && (
                  <>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-name">Full name <span className="text-danger">*</span></label>
                        <input id="signup-name" name="name" autoComplete="name" maxLength="120" className={`form-control${errors.name ? " is-invalid" : ""}`} value={data.name} onChange={(event) => update("name", event.target.value)} />
                        <FieldError>{errors.name}</FieldError>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-email">Email address <span className="text-danger">*</span></label>
                        <input id="signup-email" name="email" type="email" autoComplete="email" className={`form-control${errors.email ? " is-invalid" : ""}`} value={data.email} onChange={(event) => update("email", event.target.value)} />
                        <FieldError>{errors.email}</FieldError>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-dob">Date of birth</label>
                        <input id="signup-dob" name="dateOfBirth" type="date" max={new Date().toISOString().slice(0, 10)} className={`form-control${errors.dateOfBirth ? " is-invalid" : ""}`} value={data.dateOfBirth} onChange={(event) => update("dateOfBirth", event.target.value)} />
                        <FieldError>{errors.dateOfBirth}</FieldError>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold" htmlFor="signup-age">Age</label>
                        <input id="signup-age" className="form-control" value={age} placeholder="Calculated from DOB" readOnly aria-readonly="true" />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold" htmlFor="signup-gender">Gender</label>
                        <select id="signup-gender" name="gender" className="form-select" value={data.gender} onChange={(event) => update("gender", event.target.value)}>
                          <option value="Prefer not to say">Prefer not to say</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold" htmlFor="signup-role">I am registering as <span className="text-danger">*</span></label>
                        <select id="signup-role" name="role" className={`form-select${errors.role ? " is-invalid" : ""}`} value={data.role} onChange={(event) => update("role", event.target.value)}>
                          <option value="">Choose account type</option>
                          <option value="PATIENT">Patient</option>
                          <option value="DOCTOR">Doctor</option>
                        </select>
                        <FieldError>{errors.role}</FieldError>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && data.role === "PATIENT" && (
                  <>
                    <p className="text-secondary">These details are optional and can be changed later from My Health Profile.</p>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-height">Height (cm)</label>
                        <input id="signup-height" type="number" min="30" max="300" step="0.1" className={`form-control${errors.heightCm ? " is-invalid" : ""}`} value={data.heightCm} onChange={(event) => update("heightCm", event.target.value)} />
                        <FieldError>{errors.heightCm}</FieldError>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-weight">Weight (kg)</label>
                        <input id="signup-weight" type="number" min="1" max="500" step="0.1" className={`form-control${errors.weightKg ? " is-invalid" : ""}`} value={data.weightKg} onChange={(event) => update("weightKg", event.target.value)} />
                        <FieldError>{errors.weightKg}</FieldError>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-blood-group">Blood group</label>
                        <select id="signup-blood-group" className="form-select" value={data.bloodGroup} onChange={(event) => update("bloodGroup", event.target.value)}>
                          <option value="">Not provided</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group} value={group}>{group}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-smoking">Smoking status</label>
                        <select id="signup-smoking" className="form-select" value={data.smokingStatus} onChange={(event) => update("smokingStatus", event.target.value)}>
                          <option value="">Not provided</option>
                          <option value="NEVER">Never</option>
                          <option value="FORMER">Former</option>
                          <option value="CURRENT">Current</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-alcohol">Alcohol consumption</label>
                        <select id="signup-alcohol" className="form-select" value={data.alcoholConsumption} onChange={(event) => update("alcoholConsumption", event.target.value)}>
                          <option value="">Not provided</option>
                          <option value="NONE">None</option>
                          <option value="OCCASIONAL">Occasional</option>
                          <option value="REGULAR">Regular</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-activity">Physical activity level</label>
                        <select id="signup-activity" className="form-select" value={data.physicalActivityLevel} onChange={(event) => update("physicalActivityLevel", event.target.value)}>
                          <option value="">Not provided</option>
                          <option value="SEDENTARY">Sedentary</option>
                          <option value="LOW">Low</option>
                          <option value="MODERATE">Moderate</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && data.role === "DOCTOR" && (
                  <>
                    <p className="text-secondary">Doctor accounts remain pending until an administrator reviews the registration certificate.</p>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-license">Medical license / registration number <span className="text-danger">*</span></label>
                        <input id="signup-license" maxLength="100" className={`form-control${errors.licenseNumber ? " is-invalid" : ""}`} value={data.licenseNumber} onChange={(event) => update("licenseNumber", event.target.value)} />
                        <FieldError>{errors.licenseNumber}</FieldError>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-department">Medical department <span className="text-danger">*</span></label>
                        <select id="signup-department" className={`form-select${errors.departmentId ? " is-invalid" : ""}`} value={data.departmentId} onChange={(event) => update("departmentId", event.target.value)} disabled={loadingDepartments}>
                          <option value="">{loadingDepartments ? "Loading departments..." : "Select a department"}</option>
                          {departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}
                        </select>
                        <FieldError>{errors.departmentId || errors.departments}</FieldError>
                      </div>
                      {[
                        ["registrationAuthority", "Medical council / registration authority"],
                        ["specialization", "Medical specialization"],
                        ["qualification", "Qualification"],
                        ["facilityName", "Clinic / hospital name"],
                      ].map(([field, label]) => (
                        <div className="col-md-6" key={field}>
                          <label className="form-label fw-semibold" htmlFor={`signup-${field}`}>{label} <span className="text-muted fw-normal">(optional)</span></label>
                          <input id={`signup-${field}`} className="form-control" value={data[field]} onChange={(event) => update(field, event.target.value)} />
                        </div>
                      ))}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="signup-experience">Years of experience <span className="text-muted fw-normal">(optional)</span></label>
                        <input id="signup-experience" type="number" min="0" max="80" step="1" className={`form-control${errors.yearsOfExperience ? " is-invalid" : ""}`} value={data.yearsOfExperience} onChange={(event) => update("yearsOfExperience", event.target.value)} />
                        <FieldError>{errors.yearsOfExperience}</FieldError>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold" htmlFor="signup-document">License / registration certificate <span className="text-danger">*</span></label>
                        <input id="signup-document" type="file" className={`form-control${errors.verificationDocument ? " is-invalid" : ""}`} accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={handleDocumentChange} />
                        <div className="form-text">PDF, JPG, JPEG, or PNG; maximum 5 MB. The document is stored privately for administrator verification.</div>
                        <FieldError>{errors.verificationDocument}</FieldError>
                        {data.verificationDocument && (
                          <div className="signup-document-preview mt-3">
                            <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                              <span className="text-break"><i className="bi bi-file-earmark-medical me-2" aria-hidden="true" />{data.verificationDocument.name}</span>
                              <button type="button" className="btn btn-sm btn-outline-secondary flex-shrink-0" onClick={() => update("verificationDocument", null)}>Remove</button>
                            </div>
                            {data.verificationDocument.type.startsWith("image/") && <img src={previewUrl} alt="Selected registration certificate preview" />}
                            {data.verificationDocument.type === "application/pdf" && <iframe title="Registration certificate preview" src={previewUrl} />}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && data.role === "PATIENT" && (
                  <>
                    <p className="text-secondary">Share any information you would like to include. You can edit this later from My Health Profile.</p>
                    <div className="row g-4">
                      {MEDICAL_FIELDS.map(([field, label, placeholder]) => (
                        <MedicalHistoryTags
                          key={field}
                          field={field}
                          label={label}
                          placeholder={placeholder}
                          values={data.medicalHistory[field]}
                          draft={data.medicalDrafts[field]}
                          error={errors[field]}
                          onDraftChange={(name, value) => setData((current) => ({
                            ...current,
                            medicalDrafts: { ...current.medicalDrafts, [name]: value },
                          }))}
                          onAdd={addMedicalEntries}
                          onRemove={removeMedicalEntry}
                        />
                      ))}
                    </div>
                  </>
                )}

                {step === 3 && data.role === "DOCTOR" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="signup-professional-summary">Professional profile summary <span className="text-muted fw-normal">(optional)</span></label>
                    <textarea id="signup-professional-summary" rows="5" maxLength="2000" className="form-control" placeholder="Briefly describe your clinical experience or areas of focus." value={data.professionalSummary} onChange={(event) => update("professionalSummary", event.target.value)} />
                    <p className="form-text">You can also continue without adding a summary.</p>
                  </div>
                )}

                {step === 4 && (
                  <>
                    <p className="text-secondary">Choose a strong password to protect your account.</p>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="signup-password">Password <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <input id="signup-password" type={showPassword ? "text" : "password"} autoComplete="new-password" className={`form-control${errors.password ? " is-invalid" : ""}`} value={data.password} onChange={(event) => update("password", event.target.value)} />
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
                        <FieldError>{errors.password}</FieldError>
                      </div>
                      <div className="signup-strength mt-2" aria-label={`Password strength: ${strength.label}`}>
                        <div className="progress"><div className={`progress-bar strength-${strength.score}`} style={{ width: `${strength.score * 25}%` }} /></div>
                        <small className="text-muted">Password strength: {strength.label}</small>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="signup-confirm-password">Confirm password <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <input id="signup-confirm-password" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" className={`form-control${errors.confirmPassword ? " is-invalid" : ""}`} value={data.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} />
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>{showConfirmPassword ? "Hide" : "Show"}</button>
                        <FieldError>{errors.confirmPassword}</FieldError>
                      </div>
                    </div>
                    <ul className="signup-password-requirements">
                      <li className={data.password.length >= 8 ? "is-met" : ""}>At least 8 characters</li>
                      <li className={data.password === data.confirmPassword && data.password ? "is-met" : ""}>Passwords match</li>
                    </ul>
                    <p className="small text-muted">
                      By creating an account, you agree to the <Link to="/terms">Terms of Service</Link> and acknowledge the <Link to="/privacy">Privacy Policy</Link>. Health-information consent is requested separately before using health assessment features.
                    </p>
                    {data.role === "DOCTOR" && <div className="alert alert-info">Your account will be created with pending verification. Doctor features remain unavailable until an administrator approves your submitted document.</div>}
                  </>
                )}
              </Motion.section>
            </AnimatePresence>

            <div className="signup-wizard-actions">
              {step > 1
                ? <button type="button" className="btn btn-outline-secondary" onClick={() => { setErrors({}); setStep((current) => current - 1); }} disabled={submitting}>Back</button>
                : <Link to="/login" className="btn btn-link">Already have an account? Sign in</Link>}
              {step < 4
                ? <button type="submit" className="btn btn-primary px-4">Continue</button>
                : <button type="submit" className="btn btn-primary px-4" disabled={submitting}>{submitting ? "Creating account..." : "Create account"}</button>}
            </div>
          </form>
        </section>

        <p className="signup-wizard-footer">Secure registration · Your information is protected</p>
      </div>
    </main>
  );
}
