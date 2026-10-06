import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PrivacyPolicy() {
  const [consent, setConsent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const canManageConsent = (() => {
    try {
      return Boolean(localStorage.getItem("token") && JSON.parse(localStorage.getItem("user") || "null")?.role === "PATIENT");
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    if (!canManageConsent) return;
    apiRequest("/api/consent/health")
      .then((result) => setConsent(result.data))
      .catch((requestError) => setError(requestError.message));
  }, [canManageConsent]);

  const updateConsent = async (consentStatus) => {
    setError("");
    setMessage("");
    try {
      const result = await apiRequest("/api/consent/health", {
        method: "PUT",
        body: JSON.stringify({ consentStatus }),
      });
      setConsent(result.data);
      setMessage(consentStatus ? "Health information consent saved." : "Health information consent withdrawn.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5" style={{ maxWidth: "900px" }}>
        <h1 className="text-primary">Privacy Policy</h1>
        <p className="text-muted">This page describes how information is handled in this SwasthaLife prototype.</p>

        <h2 className="h4 mt-4">Information collected</h2>
        <p>Account information includes your name, email address, and any phone number provided. Health workflows may collect details you enter, including age, gender, symptoms, health measurements, lifestyle or history information, assessments, appointments, and emergency requests.</p>

        <h2 className="h4 mt-4">Why and how information is used</h2>
        <p>Account information supports sign-in and account administration. Health information is used to run the features you request, save assessments and related care records in the application database, show your health history, and support appointment or emergency workflows. When you submit an assessment for saving, it is associated with your account. Information shared with a clinician is limited by the application's care workflows and access controls.</p>

        <h2 className="h4 mt-4">AI assessments and chatbot</h2>
        <p>Assessment results are possible conditions and health information, not confirmed diagnoses. Assessment inputs are processed by the application's configured prediction service to produce results. Chatbot messages are sent from your browser to Google's Gemini service to generate replies. Chat messages are also saved in this browser's local storage until you clear the chat or browser data; downloaded transcripts are saved to your device. Avoid putting identifying details in chatbot messages. Refer to Google's own information for its handling of data sent to its service.</p>

        <h2 className="h4 mt-4">Storage and access</h2>
        <p>Account and health records are stored by the application using its configured MongoDB database. Chat transcripts are stored separately in your browser. This prototype does not make claims about regulatory certification or a specific retention period.</p>

        <h2 className="h4 mt-4">Managing your account and consent</h2>
        <p>You can sign out using the account menu and clear chatbot history using the chat's Clear control. If signed in as a patient, you can withdraw or renew your health-information acknowledgement below; withdrawing it prevents new saved assessments until consent is granted again. Contact the application team through the <Link to="/contact">Contact page</Link> with account questions. The current interface does not provide self-service account deletion.</p>
        {!canManageConsent && <p><Link to="/login">Sign in as a patient</Link> to view or manage your health-information acknowledgement.</p>}
        {canManageConsent && consent && (
          <section className="card mt-3">
            <div className="card-body">
              <h3 className="h5">Health information acknowledgement</h3>
              <p>Status: <strong>{consent.consentStatus ? "Granted" : "Not granted"}</strong></p>
              {consent.consentTimestamp && <p>Last updated: {new Date(consent.consentTimestamp).toLocaleString()}</p>}
              <p>Version: {consent.consentVersion || consent.currentVersion}</p>
              {consent.consentStatus
                ? <button className="btn btn-outline-danger" onClick={() => updateConsent(false)}>Withdraw acknowledgement</button>
                : <button className="btn btn-primary" onClick={() => updateConsent(true)}>Grant acknowledgement</button>}
            </div>
          </section>
        )}
        {message && <div className="alert alert-success mt-3" role="status">{message}</div>}
        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
        <p className="mt-4"><Link to="/terms">Terms of Service</Link></p>
      </main>
      <Footer />
    </>
  );
}
