import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MedicalDisclaimer from "./MedicalDisclaimer";

export default function HealthConsentGate({ children }) {
  const [consent, setConsent] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/api/consent/health")
      .then((result) => {
        if (active) setConsent(result.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const grantConsent = async () => {
    setSaving(true);
    setError("");
    try {
      const result = await apiRequest("/api/consent/health", {
        method: "PUT",
        body: JSON.stringify({ consentStatus: true }),
      });
      setConsent(result.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <><Navbar /><main className="container py-5 mt-5"><p role="status">Checking your health information consent...</p></main></>;
  }

  if (consent?.consentStatus) return children;

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5" style={{ maxWidth: "800px" }}>
        <h1 className="h2 text-primary">Before you continue</h1>
        <p>
          SwasthaLife uses information you enter, such as symptoms and health details, to provide assessment and appointment features and may save submitted assessments to your account for your health history and related care workflows.
        </p>
        <p>
          If you use the chatbot, your messages are sent to Google Gemini to generate a response and chat history is kept in this browser. Avoid including names, contact details, or other information that identifies you in chatbot messages.
        </p>
        <p>You can withdraw this acknowledgement from the Privacy Policy page. Withdrawing it prevents new health assessments until you acknowledge again.</p>
        <MedicalDisclaimer />
        <p>
          Please read our <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms">Terms of Service</Link>.
        </p>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="form-check mb-3">
          <input
            id="health-consent"
            className="form-check-input"
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="health-consent">
            I have read this information and consent to the use of my health information for these features.
          </label>
        </div>
        <button className="btn btn-primary" type="button" onClick={grantConsent} disabled={!acknowledged || saving}>
          {saving ? "Saving..." : "Continue"}
        </button>
      </main>
      <Footer />
    </>
  );
}
