import { useCallback, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { apiRequest } from "../api";

export default function AdminDoctorVerifications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState("");
  const [reviewNotes, setReviewNotes] = useState({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest("/api/admin/doctor-verifications?status=PENDING");
      setApplications(response.data || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load doctor applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const review = async (application, action) => {
    setReviewingId(application.id);
    setError("");
    setNotice("");
    try {
      const response = await apiRequest(`/api/admin/doctor-verifications/${application.id}`, {
        method: "PATCH",
        body: JSON.stringify({ action, reviewNote: reviewNotes[application.id] || "" }),
      });
      setNotice(`${application.name}: ${response.message}.`);
      setApplications((current) => current.filter((entry) => entry.id !== application.id));
    } catch (requestError) {
      setError(requestError.message || "Unable to review this application.");
    } finally {
      setReviewingId("");
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5" style={{ maxWidth: 1050 }}>
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <p className="text-uppercase small fw-semibold text-primary mb-1">Administration</p>
            <h1 className="h2 fw-bold">Doctor verification</h1>
            <p className="text-secondary mb-0">Review privately stored license documents. Approval is always an explicit administrator action.</p>
          </div>
          <button type="button" className="btn btn-outline-primary" onClick={loadApplications} disabled={loading}>Refresh</button>
        </div>
        {notice && <div className="alert alert-success" role="status">{notice}</div>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {loading && <div className="alert alert-light border" role="status">Loading applications...</div>}
        {!loading && applications.length === 0 && <div className="alert alert-info">No doctor applications are waiting for review.</div>}
        <div className="d-grid gap-3">
          {applications.map((application) => (
            <article key={application.id} className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  <div>
                    <h2 className="h5 fw-bold mb-1">{application.name}</h2>
                    <p className="text-muted">{application.email}</p>
                  </div>
                  <span className="badge text-bg-warning align-self-start">{application.verification.status}</span>
                </div>
                <dl className="row mb-3">
                  <dt className="col-sm-4">License / registration number</dt>
                  <dd className="col-sm-8">{application.licenseNumber || "Not provided"}</dd>
                  <dt className="col-sm-4">Department</dt>
                  <dd className="col-sm-8">{application.department || "Not provided"}</dd>
                  <dt className="col-sm-4">Registration authority</dt>
                  <dd className="col-sm-8">{application.professionalProfile.registrationAuthority || "Not provided"}</dd>
                  <dt className="col-sm-4">Specialization</dt>
                  <dd className="col-sm-8">{application.professionalProfile.specialization || "Not provided"}</dd>
                  <dt className="col-sm-4">Qualification</dt>
                  <dd className="col-sm-8">{application.professionalProfile.qualification || "Not provided"}</dd>
                  <dt className="col-sm-4">Facility</dt>
                  <dd className="col-sm-8">{application.professionalProfile.facilityName || "Not provided"}</dd>
                  <dt className="col-sm-4">Document</dt>
                  <dd className="col-sm-8">
                    {application.verification.document ? (
                      <>
                        <span className="me-3">{application.verification.document.originalName}</span>
                        <a href={application.verification.document.signedUrl} target="_blank" rel="noreferrer">Open private document</a>
                        <span className="small text-muted ms-2">(link expires in 5 minutes)</span>
                      </>
                    ) : "No document submitted"}
                  </dd>
                </dl>
                <label className="form-label fw-semibold" htmlFor={`review-note-${application.id}`}>Review note (optional)</label>
                <textarea
                  id={`review-note-${application.id}`}
                  className="form-control mb-3"
                  rows="2"
                  maxLength="1000"
                  value={reviewNotes[application.id] || ""}
                  onChange={(event) => setReviewNotes((current) => ({ ...current, [application.id]: event.target.value }))}
                />
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-success" onClick={() => review(application, "approve")} disabled={reviewingId === application.id || !application.verification.document}>
                    {reviewingId === application.id ? "Saving..." : "Approve verification"}
                  </button>
                  <button type="button" className="btn btn-outline-danger" onClick={() => review(application, "reject")} disabled={reviewingId === application.id}>
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
