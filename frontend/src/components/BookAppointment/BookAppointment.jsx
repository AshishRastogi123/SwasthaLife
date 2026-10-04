import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { apiRequest } from "../../api";

const initialForm = {
  departmentId: "",
  doctorId: "",
  appointmentDate: "",
  appointmentTime: "",
  reason: "",
};

const today = new Date().toISOString().slice(0, 10);

function AppointmentStatus({ status }) {
  const classes = {
    PENDING: "text-bg-warning",
    CONFIRMED: "text-bg-success",
    CANCELLED: "text-bg-secondary",
    COMPLETED: "text-bg-primary",
    NO_SHOW: "text-bg-danger",
  };
  return <span className={`badge ${classes[status] || "text-bg-secondary"}`}>{status}</span>;
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const departmentDoctors = useMemo(
    () => doctors.filter((doctor) => doctor.departmentId?._id === form.departmentId),
    [doctors, form.departmentId]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [departmentResult, doctorResult, appointmentResult] = await Promise.all([
          apiRequest("/api/departments"),
          apiRequest("/api/doctors"),
          apiRequest("/api/appointments/mine"),
        ]);
        setDepartments(departmentResult.data || []);
        setDoctors(doctorResult.data || []);
        setAppointments(appointmentResult.data || []);
      } catch (loadError) {
        if (loadError.message.includes("401") || loadError.message.includes("Unauthorized")) {
          navigate("/login");
        } else {
          setError(loadError.message);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  useEffect(() => {
    if (!form.doctorId || !form.appointmentDate) {
      setSlots([]);
      return;
    }
    const loadSlots = async () => {
      setSlotsLoading(true);
      setError("");
      try {
        const result = await apiRequest(
          `/api/appointments/available?doctorId=${encodeURIComponent(form.doctorId)}&date=${encodeURIComponent(form.appointmentDate)}`
        );
        setSlots(result.data || []);
      } catch (slotError) {
        setSlots([]);
        setError(slotError.message);
      } finally {
        setSlotsLoading(false);
      }
    };
    loadSlots();
  }, [form.doctorId, form.appointmentDate]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "departmentId" ? { doctorId: "", appointmentTime: "" } : {}),
      ...(name === "doctorId" || name === "appointmentDate" ? { appointmentTime: "" } : {}),
    }));
    setError("");
    setSuccess("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const result = await apiRequest("/api/appointments", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setAppointments((current) => [result.data, ...current]);
      setForm(initialForm);
      setSlots([]);
      setSuccess(result.message || "Appointment request persisted successfully.");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = async (appointmentId) => {
    setError("");
    try {
      const result = await apiRequest(`/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      setAppointments((current) =>
        current.map((appointment) => (appointment._id === appointmentId ? result.data : appointment))
      );
    } catch (cancelError) {
      setError(cancelError.message);
    }
  };

  if (loading) return <><Navbar /><main className="container py-5 mt-5"><p>Loading appointment booking...</p></main></>;

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5">
        <h1 className="text-primary mb-4">Book an Appointment</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form className="card shadow-sm p-4 mb-5" onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Department</label>
              <select className="form-select" name="departmentId" value={form.departmentId} onChange={updateField} required>
                <option value="">Select department</option>
                {departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Doctor</label>
              <select className="form-select" name="doctorId" value={form.doctorId} onChange={updateField} required disabled={!form.departmentId}>
                <option value="">Select doctor</option>
                {departmentDoctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.userId?.name || doctor.userId?.email}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input className="form-control" type="date" name="appointmentDate" min={today} value={form.appointmentDate} onChange={updateField} required disabled={!form.doctorId} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Available slot</label>
              <select className="form-select" name="appointmentTime" value={form.appointmentTime} onChange={updateField} required disabled={!form.appointmentDate || slotsLoading}>
                <option value="">{slotsLoading ? "Loading slots..." : "Select a slot"}</option>
                {slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
              </select>
              {!slotsLoading && form.appointmentDate && form.doctorId && slots.length === 0 && <small className="text-muted">No slots are available for this date.</small>}
            </div>
            <div className="col-12">
              <label className="form-label">Reason for visit</label>
              <textarea className="form-control" name="reason" rows="3" maxLength="1000" value={form.reason} onChange={updateField} required />
            </div>
          </div>
          <button className="btn btn-primary mt-4" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit appointment request"}
          </button>
        </form>

        <h2 className="h4 mb-3">My appointments</h2>
        {appointments.length === 0 ? <div className="alert alert-light border">No appointments found.</div> : (
          <div className="row g-3">
            {appointments.map((appointment) => (
              <div className="col-lg-6" key={appointment._id}>
                <article className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h3 className="h5">{appointment.departmentId?.name || "Department"}</h3>
                      <AppointmentStatus status={appointment.status} />
                    </div>
                    <p className="mb-1"><strong>Doctor:</strong> {appointment.doctorId?.userId?.name || "Assigned doctor"}</p>
                    <p className="mb-1"><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p className="mb-1"><strong>Time:</strong> {appointment.appointmentTime}</p>
                    <p className="mb-3"><strong>Reason:</strong> {appointment.reason}</p>
                    {["PENDING", "CONFIRMED"].includes(appointment.status) && (
                      <button className="btn btn-outline-danger btn-sm" onClick={() => cancel(appointment._id)}>Cancel appointment</button>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
