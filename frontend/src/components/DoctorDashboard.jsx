import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { apiRequest } from "../api";
import MedicalDisclaimer from "./MedicalDisclaimer";

const statuses = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [stats, setStats] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status !== "ALL") params.set("status", status);
      if (date) params.set("date", date);
      const result = await apiRequest(`/api/appointments/assigned${params.toString() ? `?${params}` : ""}`);
      setAppointments(result.data || []);
    } catch (loadError) {
      if (loadError.message.includes("Unauthorized") || loadError.message.includes("Forbidden")) navigate("/login");
      else setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [date, navigate, status]);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  useEffect(() => {
    apiRequest("/api/doctors/me/dashboard")
      .then((result) => setStats(result.data))
      .catch((statsError) => setError(statsError.message));
  }, []);

  const updateStatus = async (id, nextStatus) => {
    setError("");
    try {
      const result = await apiRequest(`/api/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setAppointments((current) => current.map((item) => item._id === id ? { ...item, ...result.data } : item));
      setSelectedAppointment((current) => current?._id === id ? { ...current, ...result.data } : current);
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const visibleAppointments = appointments.filter((appointment) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [
      appointment.patientId?.name,
      appointment.patientId?.email,
      appointment.reason,
    ].some((value) => value?.toLowerCase().includes(query));
  });

  const reviewAssessment = async () => {
    const assessmentId = selectedAppointment?.assessmentId?._id;
    if (!assessmentId) return;
    setReviewing(true);
    setError("");
    try {
      const result = await apiRequest(`/api/assessments/${assessmentId}/review`, {
        method: "PATCH",
        body: JSON.stringify({ clinicalNotes: reviewNotes }),
      });
      setSelectedAppointment((current) => ({ ...current, assessmentId: result.data }));
      setReviewNotes("");
      setStats((current) => current ? { ...current, pendingAssessmentReviews: Math.max(current.pendingAssessmentReviews - 1, 0) } : current);
    } catch (reviewError) {
      setError(reviewError.message);
    } finally {
      setReviewing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5">
        <h1 className="text-primary mb-4">Doctor appointments</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {stats && (
          <div className="row g-3 mb-4">
            {[
              ["Today's appointments", stats.todayAppointments],
              ["Pending", stats.pendingAppointments],
              ["Confirmed", stats.confirmedAppointments],
              ["Completed", stats.completedAppointments],
              ["Assessment reviews", stats.pendingAssessmentReviews],
              ["Emergency attention", stats.emergencyRequestsRequiringAttention],
            ].map(([label, value]) => (
              <div className="col-sm-6 col-lg-4" key={label}>
                <div className="card shadow-sm h-100"><div className="card-body">
                  <div className="text-muted small">{label}</div>
                  <div className="display-6 text-primary">{value}</div>
                </div></div>
              </div>
            ))}
          </div>
        )}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Filter by status</label>
            <select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}>
              {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Search patient or reason</label>
            <input className="form-control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, or reason" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Filter by date</label>
            <input className="form-control" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
        </div>
        {loading ? <p>Loading assigned appointments...</p> : visibleAppointments.length === 0 ? (
          <div className="alert alert-light border">No assigned appointments match these filters.</div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Patient</th><th>Date</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {visibleAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.patientId?.name}<br /><small>{appointment.patientId?.email}</small></td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}<br />{appointment.appointmentTime}</td>
                    <td>{appointment.reason}</td>
                    <td><span className="badge text-bg-secondary">{appointment.status}</span></td>
                    <td className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedAppointment(appointment)}>Details</button>
                      {appointment.status === "PENDING" && <button className="btn btn-sm btn-success" onClick={() => updateStatus(appointment._id, "CONFIRMED")}>Confirm</button>}
                      {appointment.status === "CONFIRMED" && <button className="btn btn-sm btn-primary" onClick={() => updateStatus(appointment._id, "COMPLETED")}>Complete</button>}
                      {["PENDING", "CONFIRMED"].includes(appointment.status) && <button className="btn btn-sm btn-outline-danger" onClick={() => updateStatus(appointment._id, "CANCELLED")}>Cancel</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedAppointment && (
          <section className="card shadow-sm mt-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h2 className="h5">Appointment details</h2>
                <button className="btn-close" aria-label="Close details" onClick={() => setSelectedAppointment(null)} />
              </div>
              <p><strong>Patient:</strong> {selectedAppointment.patientId?.name}</p>
              <p><strong>Email:</strong> {selectedAppointment.patientId?.email}</p>
              <p><strong>Phone:</strong> {selectedAppointment.patientId?.phone || "Not provided"}</p>
              <p><strong>Date/time:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()} at {selectedAppointment.appointmentTime}</p>
              <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
              {selectedAppointment.assessmentId && (
                <div className="alert alert-light border">
                  <h3 className="h6">Patient assessment</h3>
                  <MedicalDisclaimer />
                  <p><strong>Possible condition:</strong> {selectedAppointment.assessmentId.prediction?.disease || "Unavailable"}</p>
                  <p><strong>Symptoms:</strong> {(selectedAppointment.assessmentId.symptoms || []).join(", ") || "Not provided"}</p>
                  <p><strong>Vitals:</strong> {selectedAppointment.assessmentId.vitals ? JSON.stringify(selectedAppointment.assessmentId.vitals) : "Not collected"}</p>
                  <p><strong>Medical history:</strong> {selectedAppointment.assessmentId.familyHistory?.length ? selectedAppointment.assessmentId.familyHistory.join(", ") : "Not provided"}</p>
                  <p><strong>Allergies:</strong> {(selectedAppointment.assessmentId.allergies || []).join(", ") || "Not provided"}</p>
                  <p><strong>Assessment timestamp:</strong> {new Date(selectedAppointment.assessmentId.createdAt).toLocaleString()}</p>
                  <p><strong>Review status:</strong> {selectedAppointment.assessmentId.reviewStatus}</p>
                  {selectedAppointment.assessmentId.clinicalNotes && <p><strong>Existing notes:</strong> {selectedAppointment.assessmentId.clinicalNotes}</p>}
                  {selectedAppointment.assessmentId.reviewStatus !== "REVIEWED" && (
                    <>
                      <label className="form-label" htmlFor="clinical-notes">Doctor review notes</label>
                      <textarea id="clinical-notes" className="form-control mb-2" rows="3" maxLength="5000" value={reviewNotes} onChange={(event) => setReviewNotes(event.target.value)} />
                      <button className="btn btn-sm btn-primary" disabled={reviewing} onClick={reviewAssessment}>{reviewing ? "Saving review..." : "Complete review"}</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
