import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../auth/AuthContext";
import { useUserProfile } from "../hooks/useUserProfile";
import Navbar from "./Navbar";
import Footer from "./Footer";

const commaList = (value) => value.split(",").map((entry) => entry.trim()).filter(Boolean);
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

const MEDICAL_FIELDS = [
  ["existingDiseases", "Existing diseases"],
  ["allergies", "Allergies"],
  ["currentMedications", "Current medications"],
  ["previousSurgeries", "Previous surgeries"],
  ["familyMedicalHistory", "Family medical history"],
];

const HEALTH_FIELDS = [
  { name: "heightCm", label: "Height (cm)", type: "number", min: 30, max: 300, step: 0.1 },
  { name: "weightKg", label: "Weight (kg)", type: "number", min: 1, max: 500, step: 0.1 },
  { name: "bloodGroup", label: "Blood group", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  { name: "bloodPressure", label: "Blood pressure (systolic/diastolic)" },
  { name: "heartRate", label: "Heart rate (bpm)", type: "number", min: 20, max: 300 },
  { name: "bodyTemperature", label: "Body temperature (°C)", type: "number", min: 30, max: 45, step: 0.1 },
  { name: "smokingStatus", label: "Smoking status", options: ["NEVER", "FORMER", "CURRENT"], labels: ["Never", "Former", "Current"] },
  { name: "alcoholConsumption", label: "Alcohol consumption", options: ["NONE", "OCCASIONAL", "REGULAR"], labels: ["None", "Occasional", "Regular"] },
  { name: "physicalActivityLevel", label: "Physical activity level", options: ["SEDENTARY", "LOW", "MODERATE", "HIGH"], labels: ["Sedentary", "Low", "Moderate", "High"] },
];

function ProfileNavigation({ section }) {
  const links = [
    ["overview", "Profile overview", "/profile"],
    ["edit", "Personal information", "/profile/edit"],
    ["health", "Health profile", "/profile/health"],
    ["medical-history", "Medical history", "/profile/medical-history"],
  ];

  return (
    <nav className="nav nav-pills flex-wrap gap-2 mb-4" aria-label="Profile sections">
      {links.map(([key, label, to]) => (
        <Link key={key} to={to} className={`nav-link ${section === key ? "active" : ""}`}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export default function ProfilePage() {
  const { section: routeSection } = useParams();
  const section = routeSection || "overview";
  const { refreshSession } = useAuth();
  const { profile, isLoading, error, refresh } = useUserProfile();
  const [values, setValues] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!profile) return;
    setValues({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      dateOfBirth: profile.profile?.dateOfBirth || "",
      gender: profile.profile?.gender || "",
      ...Object.fromEntries(HEALTH_FIELDS.map(({ name }) => [name, profile.healthProfile?.[name] ?? ""])),
      ...Object.fromEntries(MEDICAL_FIELDS.map(([name]) => [
        name,
        (profile.medicalHistory?.[name] || []).join(", "),
      ])),
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setMessage("");
    setSaveError("");
  };

  const save = async (event) => {
    event.preventDefault();
    if (!values || isSaving) return;
    setIsSaving(true);
    setMessage("");
    setSaveError("");

    try {
      let endpoint;
      let payload;
      if (section === "edit") {
        endpoint = "/api/users/profile";
        payload = {
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          dateOfBirth: values.dateOfBirth || null,
          gender: values.gender || null,
        };
      } else if (section === "health") {
        endpoint = "/api/users/health-profile";
        payload = Object.fromEntries(HEALTH_FIELDS.map(({ name, type }) => [
          name,
          values[name] === "" ? null : type === "number" ? Number(values[name]) : values[name],
        ]));
      } else {
        endpoint = "/api/users/medical-history";
        payload = Object.fromEntries(MEDICAL_FIELDS.map(([name]) => [name, commaList(values[name])]));
      }

      const response = await apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setValues((current) => ({
        ...current,
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        dateOfBirth: response.data.profile?.dateOfBirth || "",
        gender: response.data.profile?.gender || "",
        ...Object.fromEntries(HEALTH_FIELDS.map(({ name }) => [name, response.data.healthProfile?.[name] ?? ""])),
        ...Object.fromEntries(MEDICAL_FIELDS.map(([name]) => [
          name,
          (response.data.medicalHistory?.[name] || []).join(", "),
        ])),
      }));
      setMessage(response.message || "Profile saved successfully.");
      await Promise.all([refresh(), refreshSession()]);
    } catch (requestError) {
      setSaveError(requestError.message || "Unable to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const completion = profile?.profileCompletion;

  return (
    <>
    <Navbar />
    <main className="container py-5" style={{ maxWidth: 1050, marginTop: 76 }}>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <p className="text-uppercase small fw-semibold text-primary mb-1">SwasthaLife</p>
          <h1 className="h2 fw-bold mb-1">Your profile</h1>
          <p className="text-secondary mb-0">Manage the personal and health information saved to your account.</p>
        </div>
        {completion && (
          <div className="card border-0 shadow-sm" style={{ minWidth: 220 }}>
            <div className="card-body">
              <div className="d-flex justify-content-between small mb-2">
                <span>Profile completion</span>
                <strong>{completion.percentage}%</strong>
              </div>
              <div className="progress" role="progressbar" aria-label="Profile completion" aria-valuenow={completion.percentage} aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar" style={{ width: `${completion.percentage}%` }} />
              </div>
              <small className="text-muted">{completion.completed} of {completion.total} basic details provided</small>
            </div>
          </div>
        )}
      </div>

      <ProfileNavigation section={section} />

      {isLoading && <div className="alert alert-info" role="status">Loading your profile...</div>}
      {!isLoading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button type="button" className="btn btn-sm btn-outline-danger ms-3" onClick={() => refresh()}>Try again</button>
        </div>
      )}
      {message && <div className="alert alert-success" role="status">{message}</div>}
      {saveError && <div className="alert alert-danger" role="alert">{saveError}</div>}

      {!isLoading && profile && section === "overview" && (
        <div className="row g-3">
          <div className="col-md-6">
            <section className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h5 fw-bold">Personal information</h2>
                <p className="mb-1"><strong>Name:</strong> {profile.name || "Not provided"}</p>
                <p className="mb-1"><strong>Email:</strong> {profile.email || "Not provided"}</p>
                <p className="mb-1"><strong>Mobile:</strong> {profile.phone || "Not provided"}</p>
                <p className="mb-1"><strong>Date of birth:</strong> {profile.profile?.dateOfBirth || "Not provided"}</p>
                <p className="mb-0"><strong>Age:</strong> {profile.profile?.age ?? "Not provided"}</p>
              </div>
            </section>
          </div>
          <div className="col-md-6">
            <section className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h5 fw-bold">Physical information</h2>
                <p className="mb-1"><strong>Height:</strong> {profile.healthProfile?.heightCm || "Not provided"}{profile.healthProfile?.heightCm ? " cm" : ""}</p>
                <p className="mb-1"><strong>Weight:</strong> {profile.healthProfile?.weightKg || "Not provided"}{profile.healthProfile?.weightKg ? " kg" : ""}</p>
                <p className="mb-1"><strong>Blood pressure:</strong> {profile.healthProfile?.bloodPressure || "Not provided"}</p>
                <p className="mb-0"><strong>Heart rate:</strong> {profile.healthProfile?.heartRate || "Not provided"}</p>
              </div>
            </section>
          </div>
          <div className="col-12">
            <section className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h5 fw-bold">Medical history</h2>
                <p className="mb-0">
                  {MEDICAL_FIELDS.map(([name, label]) => {
                    const entries = profile.medicalHistory?.[name] || [];
                    return entries.length ? `${label}: ${entries.join(", ")}` : null;
                  }).filter(Boolean).join(" · ") || "No medical history details provided."}
                </p>
              </div>
            </section>
          </div>
        </div>
      )}

      {!isLoading && profile && values && section === "edit" && (
        <form className="card border-0 shadow-sm" onSubmit={save}>
          <div className="card-body p-4">
            <h2 className="h4 fw-bold">Personal information</h2>
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label className="form-label" htmlFor="profile-name">Full name</label>
                <input id="profile-name" className="form-control" name="name" value={values.name} onChange={handleChange} maxLength="120" required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="profile-email">Email (account sign-in)</label>
                <input id="profile-email" className="form-control" name="email" type="email" value={values.email} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="profile-phone">Mobile number (optional)</label>
                <input id="profile-phone" className="form-control" name="phone" type="tel" value={values.phone} onChange={handleChange} maxLength="30" />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="profile-dob">Date of birth (optional)</label>
                <input id="profile-dob" className="form-control" name="dateOfBirth" type="date" max={new Date().toISOString().slice(0, 10)} value={values.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="col-md-2">
                <label className="form-label" htmlFor="profile-age">Age</label>
                <input id="profile-age" className="form-control" value={calculateAge(values.dateOfBirth)} placeholder="From DOB" readOnly />
              </div>
              <div className="col-md-2">
                <label className="form-label" htmlFor="profile-gender">Gender (optional)</label>
                <select id="profile-gender" className="form-select" name="gender" value={values.gender} onChange={handleChange}>
                  <option value="">Not provided</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-4" disabled={isSaving}>{isSaving ? "Saving..." : "Save personal information"}</button>
          </div>
        </form>
      )}

      {!isLoading && profile && values && section === "health" && (
        <form className="card border-0 shadow-sm" onSubmit={save}>
          <div className="card-body p-4">
            <h2 className="h4 fw-bold">Health profile</h2>
            <p className="text-secondary">All fields are optional. Values are used only where they match an assessment input, and saving this form does not submit a prediction.</p>
            <div className="row g-3">
              {HEALTH_FIELDS.map((field) => (
                <div className="col-md-6" key={field.name}>
                  <label className="form-label" htmlFor={`health-${field.name}`}>{field.label}</label>
                  {field.options ? (
                    <select id={`health-${field.name}`} className="form-select" name={field.name} value={values[field.name]} onChange={handleChange}>
                      <option value="">Not provided</option>
                      {field.options.map((option, index) => <option key={option} value={option}>{field.labels?.[index] || option}</option>)}
                    </select>
                  ) : (
                    <input
                      id={`health-${field.name}`}
                      className="form-control"
                      name={field.name}
                      type={field.type || "text"}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={values[field.name]}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary mt-4" disabled={isSaving}>{isSaving ? "Saving..." : "Save health profile"}</button>
          </div>
        </form>
      )}

      {!isLoading && profile && values && section === "medical-history" && (
        <form className="card border-0 shadow-sm" onSubmit={save}>
          <div className="card-body p-4">
            <h2 className="h4 fw-bold">Medical history</h2>
            <p className="text-secondary">Optional. Separate multiple entries with commas. This information is not silently added to a prediction.</p>
            <div className="row g-3">
              {MEDICAL_FIELDS.map(([name, label]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label" htmlFor={`medical-${name}`}>{label}</label>
                  <textarea id={`medical-${name}`} className="form-control" name={name} rows="3" maxLength="10000" value={values[name]} onChange={handleChange} />
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary mt-4" disabled={isSaving}>{isSaving ? "Saving..." : "Save medical history"}</button>
          </div>
        </form>
      )}

      {!isLoading && profile && !["overview", "edit", "health", "medical-history"].includes(section) && (
        <div className="alert alert-warning">That profile section is not available.</div>
      )}
    </main>
    <Footer />
    </>
  );
}
