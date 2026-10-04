import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { apiRequest } from "../api";

const statuses = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  const updateStatus = async (id, nextStatus) => {
    setError("");
    try {
      const result = await apiRequest(`/api/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setAppointments((current) => current.map((item) => item._id === id ? result.data : item));
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5">
        <h1 className="text-primary mb-4">Doctor appointments</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Filter by status</label>
            <select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}>
              {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Filter by date</label>
            <input className="form-control" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
        </div>
        {loading ? <p>Loading assigned appointments...</p> : appointments.length === 0 ? (
          <div className="alert alert-light border">No assigned appointments match these filters.</div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Patient</th><th>Date</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.map((appointment) => (
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
                  <strong>Assessment:</strong> {selectedAppointment.assessmentId.prediction?.disease || "Assessment available"}; symptoms: {(selectedAppointment.assessmentId.symptoms || []).join(", ") || "Not provided"}.
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
