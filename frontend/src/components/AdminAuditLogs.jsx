import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import Navbar from "./Navbar";

const actions = [
  "auth.login.success",
  "auth.login.failure",
  "auth.logout",
  "admin.user.activated",
  "admin.user.deactivated",
  "admin.doctor.created",
  "admin.department.created",
  "admin.department.updated",
  "appointment.created",
  "appointment.confirmed",
  "appointment.cancelled",
  "appointment.completed",
  "appointment.status_changed",
  "emergency.created",
  "emergency.acknowledged",
  "emergency.status_changed",
  "emergency.resolved",
  "doctor.assessment.reviewed",
  "doctor.note.created",
  "security.unauthorized",
];

export default function AdminAuditLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({
    search: "",
    action: "",
    userId: "",
    role: "",
    startDate: "",
    endDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAuditLogs = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page, limit: 25 });
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    try {
      const result = await apiRequest(`/api/admin/audit-logs?${params}`);
      setLogs(result.data || []);
      setPagination(result.pagination || { page, pages: 1 });
    } catch (loadError) {
      if (loadError.message.includes("Unauthorized") || loadError.message.includes("Forbidden")) {
        navigate("/login");
      } else {
        setError(loadError.message);
      }
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, navigate]);

  useEffect(() => {
    loadAuditLogs();
    apiRequest("/api/users?limit=100")
      .then((result) => setUsers(result.data || []))
      .catch((loadError) => setError(loadError.message));
  }, [loadAuditLogs]);

  const changeFilter = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
          <div>
            <h1 className="text-primary mb-1">Audit logs</h1>
            <p className="text-muted mb-0">Security and operational activity. Medical notes and credentials are not included.</p>
          </div>
          <button className="btn btn-outline-primary" onClick={() => navigate("/admin")}>Admin dashboard</button>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <form
          className="card shadow-sm mb-4"
          onSubmit={(event) => {
            event.preventDefault();
            setAppliedFilters(filters);
          }}
        >
          <div className="card-body">
            <div className="row g-2 align-items-end">
              <div className="col-md-4">
                <label className="form-label" htmlFor="audit-search">Search</label>
                <input id="audit-search" className="form-control" name="search" value={filters.search} onChange={changeFilter} placeholder="Action, resource, user name or email" />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="audit-action">Action</label>
                <select id="audit-action" className="form-select" name="action" value={filters.action} onChange={changeFilter}>
                  <option value="">All actions</option>
                  {actions.map((action) => <option key={action} value={action}>{action}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="audit-user">User</label>
                <select id="audit-user" className="form-select" name="userId" value={filters.userId} onChange={changeFilter}>
                  <option value="">All users</option>
                  {users.map((user) => <option key={user._id} value={user._id}>{user.name} ({user.email})</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="audit-role">Role</label>
                <select id="audit-role" className="form-select" name="role" value={filters.role} onChange={changeFilter}>
                  <option value="">All roles</option>
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
                  <option value="UNKNOWN">Unknown</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="audit-start-date">From</label>
                <input id="audit-start-date" className="form-control" type="date" name="startDate" value={filters.startDate} onChange={changeFilter} />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="audit-end-date">To</label>
                <input id="audit-end-date" className="form-control" type="date" name="endDate" value={filters.endDate} onChange={changeFilter} />
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button className="btn btn-primary flex-grow-1" type="submit" disabled={loading}>Search</button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => {
                  const cleared = { search: "", action: "", userId: "", role: "", startDate: "", endDate: "" };
                  setFilters(cleared);
                  setAppliedFilters(cleared);
                }}>Clear</button>
              </div>
            </div>
          </div>
        </form>

        <section className="card shadow-sm">
          <div className="card-body">
            {loading ? <p className="mb-0" role="status">Loading audit logs...</p> : logs.length === 0 ? (
              <div className="alert alert-light border mb-0">No audit events match the selected filters.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead><tr><th>Time</th><th>Actor</th><th>Role</th><th>Action</th><th>Resource</th><th>Outcome</th><th>Change</th></tr></thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id}>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td>{log.actor?.name || "Unknown"}{log.actor?.email && <div className="small text-muted">{log.actor.email}</div>}</td>
                        <td>{log.actorRole}</td>
                        <td><code>{log.action}</code>{log.failureReason && <div className="small text-muted">{log.failureReason}</div>}</td>
                        <td>{log.resourceType}{log.resourceId && <div className="small text-muted text-break">{log.resourceId}</div>}</td>
                        <td><span className={`badge ${log.success ? "text-bg-success" : "text-bg-danger"}`}>{log.success ? "Success" : "Failure"}</span></td>
                        <td>{log.changes?.fromStatus && <>{log.changes.fromStatus} → </>}{log.changes?.toStatus || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {pagination.pages > 1 && (
              <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-sm btn-outline-primary" disabled={loading || pagination.page <= 1} onClick={() => loadAuditLogs(pagination.page - 1)}>Previous</button>
                <span>Page {pagination.page} of {pagination.pages} ({pagination.total} events)</span>
                <button className="btn btn-sm btn-outline-primary" disabled={loading || !pagination.hasNextPage} onClick={() => loadAuditLogs(pagination.page + 1)}>Next</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
