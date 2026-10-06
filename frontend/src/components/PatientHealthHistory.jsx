import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import MedicalDisclaimer from "./MedicalDisclaimer";
import { apiRequest } from "../api";

const badgeClass = {
  PENDING: "text-bg-warning",
  REVIEWED: "text-bg-success",
  CONFIRMED: "text-bg-success",
  COMPLETED: "text-bg-primary",
  RESOLVED: "text-bg-success",
  CANCELLED: "text-bg-secondary",
  NEW: "text-bg-danger",
  ACKNOWLEDGED: "text-bg-warning",
  IN_PROGRESS: "text-bg-warning",
};

export default function PatientHealthHistory() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest(`/api/history/mine?page=${page}&limit=10`);
      setEvents(result.data || []);
      setPagination(result.pagination || { page, pages: 1 });
    } catch (loadError) {
      if (loadError.message.includes("Unauthorized") || loadError.message.includes("401")) {
        navigate("/login");
      } else {
        setError(loadError.message);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5">
        <h1 className="text-primary mb-2">Health history</h1>
        <p className="text-muted mb-4">Your saved assessments, appointments, emergency requests, and permitted clinical reviews.</p>
        <MedicalDisclaimer />
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? <div className="alert alert-light border">Loading health history...</div> : events.length === 0 ? (
          <div className="alert alert-light border">No health history records found yet.</div>
        ) : (
          <div className="timeline">
            {events.map((event) => (
              <article className="card shadow-sm mb-3" key={event.id}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <span className="text-uppercase small text-muted">{event.type}</span>
                      <h2 className="h5 mb-1">{event.title}</h2>
                      <div className="small text-muted">{new Date(event.date).toLocaleString()}</div>
                    </div>
                    <span className={`badge ${badgeClass[event.status] || "text-bg-secondary"}`}>{event.status}</span>
                  </div>
                  <p className="mt-3 mb-2">{event.summary}</p>
                  {event.type === "APPOINTMENT" && (
                    <p className="small text-muted mb-2">
                      {event.department?.name || "Department"} · {event.doctor?.name || "Doctor"} · {event.appointmentTime}
                    </p>
                  )}
                  {event.symptoms?.length > 0 && <p className="small mb-2"><strong>Symptoms:</strong> {event.symptoms.join(", ")}</p>}
                  {event.review && (
                    <div className="alert alert-light border mb-0">
                      <strong>Doctor review / outcome</strong>
                      {event.review.notes && <p className="mb-0 mt-1">{event.review.notes}</p>}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        {!loading && pagination.pages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <button className="btn btn-outline-primary" disabled={pagination.page <= 1} onClick={() => loadHistory(pagination.page - 1)}>Previous</button>
            <span>Page {pagination.page} of {pagination.pages}</span>
            <button className="btn btn-outline-primary" disabled={!pagination.hasNextPage} onClick={() => loadHistory(pagination.page + 1)}>Next</button>
          </div>
        )}
      </main>
    </>
  );
}
