import React, { useState, useEffect } from "react";
import "./EmergencyForm.css";

const MAX_SYMPTOMS = 300;

const emergencyWeights = {
  accident: 90,
  cardiac: 100,
  respiratory: 95,
  pediatric: 85,
  other: 60,
};

const phoneIsValid = (phone) => {
  // Accepts 10 digit Indian style numbers (simple)
  const cleaned = phone.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(cleaned);
};

const EmergencyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    emergency: "",
    symptoms: "",
    preferredTime: "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [urgency, setUrgency] = useState(0);

  useEffect(() => {
    // scroll margin for fixed navbar (if present)
    const section = document.getElementById("emergency-section");
    if (section) section.style.scrollMarginTop = "80px";
  }, []);

  useEffect(() => {
    // compute urgency score from type + symptoms length
    const base = emergencyWeights[formData.emergency] || 40;
    const lengthFactor = Math.min(formData.symptoms.length / MAX_SYMPTOMS, 1);
    const computed = Math.round(base * (0.6 + 0.4 * lengthFactor));
    setUrgency(computed);
  }, [formData.emergency, formData.symptoms]);

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const validate = (values) => {
    const e = {};
    if (!values.name.trim()) e.name = "Full name is required";
    if (!values.phone.trim()) e.phone = "Phone number is required";
    else if (!phoneIsValid(values.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!values.emergency) e.emergency = "Choose emergency type";
    if (!values.symptoms.trim()) e.symptoms = "Brief description required";
    else if (values.symptoms.length > MAX_SYMPTOMS) e.symptoms = `Max ${MAX_SYMPTOMS} characters allowed`;
    return e;
  };

  useEffect(() => {
    setErrors(validate(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // phone field: format lightly (allow spaces/dashes) but store raw
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      phone: true,
      emergency: true,
      symptoms: true,
    });
    const currentErrors = validate(formData);
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Emergency Form Data:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setShowToast(true);

      // reset after short duration
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          phone: "",
          emergency: "",
          symptoms: "",
          preferredTime: "",
        });
        setTouched({});
      }, 2200);
    }, 1400);
  };

  const remaining = MAX_SYMPTOMS - formData.symptoms.length;
  const isValid = Object.keys(errors).length === 0;

  return (
    <section
      id="emergency-section"
      className="emergency-section interactive"
      aria-labelledby="emergency-heading"
    >
      <div className="emergency-container">
        <div className="emergency-header">
          <h2 id="emergency-heading">🚨 Emergency Appointment</h2>
          <p>Quick response for urgent medical care — we will contact you immediately.</p>
        </div>

        <div className="urgency-row" aria-hidden>
          <div className="urgency-info">
            <strong>Urgency:</strong>
            <span className="urgency-score" aria-live="polite"> {urgency}%</span>
          </div>
          <div className="urgency-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={urgency}>
            <div className="urgency-fill" style={{ width: `${urgency}%` }} />
          </div>
        </div>

        {isSubmitted && !isSubmitting ? (
          <div className="success-message" role="status" aria-live="polite">
            <h3>✅ Emergency Request Submitted!</h3>
            <p>We will contact you right away on {formData.phone || "the provided phone number"}.</p>
          </div>
        ) : (
          <form className="emergency-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="name">Full Name*</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!(touched.name && errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {touched.name && errors.name && <small id="name-error" className="error-text">{errors.name}</small>}
            </div>

            <div className="form-row">
              <label htmlFor="phone">Phone Number*</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="e.g. 98xxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!(touched.phone && errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {touched.phone && errors.phone && <small id="phone-error" className="error-text">{errors.phone}</small>}
            </div>

            <div className="form-row">
              <label htmlFor="emergency">Emergency Type*</label>
              <select
                id="emergency"
                name="emergency"
                value={formData.emergency}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!(touched.emergency && errors.emergency)}
                aria-describedby={errors.emergency ? "emergency-error" : undefined}
              >
                <option value="">Select emergency type</option>
                <option value="accident">Accident & Trauma</option>
                <option value="cardiac">Cardiac Emergency</option>
                <option value="respiratory">Breathing Difficulty</option>
                <option value="pediatric">Pediatric Emergency</option>
                <option value="other">Other Emergency</option>
              </select>
              {touched.emergency && errors.emergency && <small id="emergency-error" className="error-text">{errors.emergency}</small>}
            </div>

            <div className="form-row">
              <label htmlFor="symptoms">Brief Description of Symptoms* <span className="muted">({remaining} left)</span></label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows="4"
                maxLength={MAX_SYMPTOMS}
                placeholder="Describe symptoms or what's happening (max 300 chars)"
                value={formData.symptoms}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!(touched.symptoms && errors.symptoms)}
                aria-describedby={errors.symptoms ? "symptoms-error" : undefined}
              />
              <div className="symptom-meta">
                <small className="muted">Char count: {formData.symptoms.length}/{MAX_SYMPTOMS}</small>
              </div>
              {touched.symptoms && errors.symptoms && <small id="symptoms-error" className="error-text">{errors.symptoms}</small>}
            </div>

            <div className="form-row">
              <label htmlFor="preferredTime">Preferred Contact Time (optional)</label>
              <input
                id="preferredTime"
                name="preferredTime"
                type="text"
                placeholder="e.g. ASAP / Within 30 mins / After 6 PM"
                value={formData.preferredTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={!isValid || isSubmitting}
                aria-disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner" aria-hidden /> Sending...
                  </>
                ) : (
                  "Request Emergency Appointment"
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Toast */}
      <div className={`toast-notification ${showToast ? "show" : ""}`} role="status" aria-live="polite">
        <strong>Request received</strong>
        <div className="toast-body">Our team will call you shortly — stay by your phone.</div>
      </div>
    </section>
  );
};

export default EmergencyForm;
