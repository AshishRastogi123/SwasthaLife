import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MedicalDisclaimer from "../MedicalDisclaimer";
import { apiRequest } from "../../api";
import { useUserProfile } from "../../hooks/useUserProfile";
import { mapProfileToHeartDisease } from "../../utils/predictionProfileMappings";

const INITIAL_VALUES = {
  age: "",
  sex: "",
  cp: "",
  trestbps: "",
  chol: "",
  fbs: "",
  restecg: "",
  thalach: "",
  exang: "",
  oldpeak: "",
  slope: "",
  ca: "",
  thal: "",
};

const FIELDS = [
  { name: "age", label: "Age (years)", type: "number", min: 1, max: 120, step: 1 },
  { name: "sex", label: "Sex in model data", options: [["0", "Female"], ["1", "Male"]] },
  { name: "cp", label: "Chest pain type", options: [["0", "Typical angina"], ["1", "Atypical angina"], ["2", "Non-anginal pain"], ["3", "Asymptomatic"]] },
  { name: "trestbps", label: "Resting blood pressure (mm Hg)", type: "number", min: 50, max: 250, step: 1 },
  { name: "chol", label: "Serum cholesterol (mg/dL)", type: "number", min: 100, max: 700, step: 1 },
  { name: "fbs", label: "Fasting blood sugar over 120 mg/dL?", options: [["0", "No"], ["1", "Yes"]] },
  { name: "restecg", label: "Resting ECG result", options: [["0", "Normal"], ["1", "ST-T wave abnormality"], ["2", "Left ventricular hypertrophy"]] },
  { name: "thalach", label: "Maximum heart rate achieved (bpm)", type: "number", min: 50, max: 250, step: 1 },
  { name: "exang", label: "Exercise-induced angina?", options: [["0", "No"], ["1", "Yes"]] },
  { name: "oldpeak", label: "ST depression induced by exercise", type: "number", min: -3, max: 10, step: 0.1 },
  { name: "slope", label: "Slope of peak exercise ST segment", options: [["0", "Upsloping"], ["1", "Flat"], ["2", "Downsloping"]] },
  { name: "ca", label: "Major vessels (0-4) colored by fluoroscopy", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]], optional: true },
  { name: "thal", label: "Thalassemia result", options: [["0", "Unknown / not recorded"], ["1", "Fixed defect"], ["2", "Normal"], ["3", "Reversible defect"]], optional: true },
];

export default function HeartDiseaseRiskForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileDerivedFields, setProfileDerivedFields] = useState(() => new Set());
  const touchedFields = useRef(new Set());
  const { profile, isLoading: isProfileLoading, error: profileError } = useUserProfile();

  useEffect(() => {
    if (!profile) return;
    const mapped = mapProfileToHeartDisease(profile);
    setValues((current) => {
      const next = { ...current };
      Object.entries(mapped).forEach(([field, value]) => {
        if (!touchedFields.current.has(field) && current[field] === "") {
          next[field] = value;
        }
      });
      return next;
    });
    const mappedFields = Object.keys(mapped).filter((field) => !touchedFields.current.has(field));
    setProfileDerivedFields((previous) => new Set([...previous, ...mappedFields]));
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    touchedFields.current.add(name);
    setProfileDerivedFields((previous) => {
      const next = new Set(previous);
      next.delete(name);
      return next;
    });
    setValues((current) => ({ ...current, [name]: value }));
    setResult(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError("");

    const optionalFields = new Set(["ca", "thal"]);
    const missingField = FIELDS.find((field) => !field.optional && values[field.name] === "");
    if (missingField) {
      setError(`${missingField.label} is required.`);
      setIsLoading(false);
      return;
    }
    const payload = Object.fromEntries(
      Object.entries(values).map(([name, value]) => [
        name,
        value === "" && optionalFields.has(name) ? null : Number(value),
      ])
    );

    try {
      const prediction = await apiRequest("/api/heart/predict", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setResult(prediction);
    } catch (requestError) {
      if (requestError.status === 401) {
        setError("Sign in with a patient account to run this assessment.");
      } else if (requestError.status === 403) {
        setError("Patient access and current health-information consent are required.");
      } else if (requestError.status === 503) {
        setError("The heart assessment model is currently unavailable. Please try again later.");
      } else {
        setError(requestError.message || "Unable to run the heart assessment.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-5" style={{ background: "#f8fafc" }} aria-labelledby="heart-risk-title">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h2 id="heart-risk-title" className="h3 fw-bold text-center mb-3" style={{ color: "#2563eb" }}>
                  Heart Disease Model Assessment
                </h2>
                <p className="text-center text-secondary mb-4">
                  Enter the measurements and coded results below to receive an informational model estimate.
                  This assessment requires a signed-in patient account and current health-information consent.
                </p>
                <MedicalDisclaimer />
                <p className="small text-muted">
                  {isProfileLoading
                    ? "Checking your saved profile..."
                    : "Values marked Saved profile are copied from your profile. Review or edit them before running the assessment."}
                </p>
                {profileError && <div className="alert alert-warning" role="alert">Saved profile details could not be loaded: {profileError}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {FIELDS.map((field) => (
                      <div className="col-md-6 mb-3" key={field.name}>
                        <label className="form-label fw-semibold" htmlFor={`heart-${field.name}`}>
                          {field.label}{field.optional ? " (optional)" : " *"}
                          {profileDerivedFields.has(field.name) && <span className="badge text-bg-info ms-2">Saved profile</span>}
                        </label>
                        {field.options ? (
                          <select
                            id={`heart-${field.name}`}
                            name={field.name}
                            value={values[field.name]}
                            onChange={handleChange}
                            className="form-select"
                            required={!field.optional}
                            disabled={isLoading}
                          >
                            <option value="">Select{field.optional ? " or leave unknown" : ""}</option>
                            {field.options.map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={`heart-${field.name}`}
                            name={field.name}
                            type="number"
                            value={values[field.name]}
                            onChange={handleChange}
                            className="form-control"
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            required
                            disabled={isLoading}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {error && <div className="alert alert-warning" role="alert">{error}</div>}
                  {result && (
                    <div className={`alert ${result.has_heart_disease ? "alert-warning" : "alert-success"}`} role="status">
                      <h3 className="h5 fw-bold">
                        Model result: {result.prediction_label} ({result.prediction})
                      </h3>
                      <p className="mb-0">
                        Model score for the heart-disease class:{" "}
                        {(result.positive_class_probability * 100).toFixed(1)}%.
                        This score is not a diagnosis or a calibrated personal risk estimate.
                      </p>
                      {result.assessmentId && (
                        <p className="mb-0 mt-2">
                          Assessment saved. <Link to="/health-history">View it in your health history</Link>.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-center mt-3">
                    <button type="submit" className="btn btn-primary px-4" disabled={isLoading}>
                      {isLoading ? "Assessing..." : "Run heart assessment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
