import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../auth/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function DoctorVerificationPending() {
  const { user, refreshSession } = useAuth();
  const [file, setFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDocument = async () => {
    setLoadingDocument(true);
    setError("");
    try {
      const result = await apiRequest("/api/doctors/me/verification-document");
      setDocumentUrl(result.data.document.signedUrl);
    } catch (requestError) {
      setError(requestError.message || "Unable to open the submitted document.");
    } finally {
      setLoadingDocument(false);
    }
  };

  const replaceDocument = async (event) => {
    event.preventDefault();
    if (!file || submitting) return;
    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      setError("Choose a PDF, JPG, JPEG, or PNG file no larger than 5 MB.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");
    const body = new FormData();
    body.append("verificationDocument", file);
    try {
      const result = await apiRequest("/api/doctors/me/verification-document", {
        method: "PUT",
        body,
      });
      setMessage(result.message);
      setFile(null);
      setDocumentUrl("");
      await refreshSession();
    } catch (requestError) {
      setError(requestError.message || "Unable to submit the verification document.");
    } finally {
      setSubmitting(false);
    }
  };

  const status = user?.doctorVerificationStatus || "NOT_SUBMITTED";

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5" style={{ maxWidth: 850 }}>
        <p className="text-uppercase small fw-semibold text-primary mb-1">Doctor account</p>
        <h1 className="h2 fw-bold">Verification {status === "APPROVED" ? "complete" : "in progress"}</h1>
        <div className={`alert ${status === "REJECTED" ? "alert-warning" : "alert-info"}`} role="status">
          {status === "PENDING" && "Your registration document is awaiting administrator review. Doctor-only features are unavailable until approval."}
          {status === "REJECTED" && "Your registration document was not approved. Upload a corrected document to request another review."}
          {status === "NOT_SUBMITTED" && "Submit your license or registration certificate to begin verification. Doctor-only features remain unavailable until approval."}
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {message && <div className="alert alert-success" role="status">{message}</div>}

        {status !== "NOT_SUBMITTED" && (
          <div className="d-flex flex-wrap gap-2 mb-4">
            <button type="button" className="btn btn-outline-primary" onClick={loadDocument} disabled={loadingDocument}>
              {loadingDocument ? "Loading document..." : "View submitted document"}
            </button>
            {documentUrl && <a className="btn btn-outline-secondary" href={documentUrl} target="_blank" rel="noreferrer">Open private document</a>}
          </div>
        )}
        {documentUrl && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <iframe title="Private verification document" src={documentUrl} className="w-100 border-0" style={{ height: 480 }} />
            </div>
          </div>
        )}

        {status !== "APPROVED" && (
          <form className="card border-0 shadow-sm" onSubmit={replaceDocument}>
            <div className="card-body">
              <h2 className="h5 fw-bold">Submit or replace a document</h2>
              <p className="text-muted">Private PDF, JPG, JPEG, or PNG file; maximum 5 MB.</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="form-control mb-3"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
              {file && <p className="small text-muted">Selected: {file.name}</p>}
              <button type="submit" className="btn btn-primary" disabled={!file || submitting}>
                {submitting ? "Uploading..." : "Submit for verification"}
              </button>
            </div>
          </form>
        )}
        <p className="mt-4"><Link to="/">Return to SwasthaLife</Link></p>
      </main>
      <Footer />
    </>
  );
}
