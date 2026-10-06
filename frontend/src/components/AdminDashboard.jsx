import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";
import { apiRequest } from "../api";

const statCards = [
  ["totalPatients", "Patients"],
  ["totalDoctors", "Doctors"],
  ["totalDepartments", "Departments"],
  ["todayAppointments", "Today's appointments"],
  ["pendingAppointments", "Pending appointments"],
  ["emergencyRequests", "Emergency requests"],
  ["activeUsers", "Active users"],
];

function AdminDashboardContent() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    const result = await apiRequest("/api/admin/dashboard");
    setStats(result.data);
  }, []);

  const loadUsers = useCallback(async (page = 1) => {
    setUsersLoading(true);
    const params = new URLSearchParams({ page, limit: 10 });
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    const result = await apiRequest(`/api/users?${params}`);
    setUsers(result.data || []);
    setPagination(result.pagination || { page, pages: 1 });
    setUsersLoading(false);
  }, [filters]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadStats(), loadUsers()]);
    } catch (loadError) {
      if (loadError.message.includes("Unauthorized") || loadError.message.includes("Forbidden")) navigate("/login");
      else setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [loadStats, loadUsers, navigate]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateStatus = async (user) => {
    try {
      const result = await apiRequest(`/api/users/${user._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      setUsers((current) => current.map((item) => item._id === user._id ? result.data : item));
      await loadStats();
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4 gap-2">
          <div><h1 className="text-primary mb-1">Admin Dashboard</h1><p className="text-muted mb-0">Live operational data from MongoDB.</p></div>
          <button className="btn btn-outline-primary" onClick={refresh} disabled={loading}>Refresh</button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && !stats ? <div className="alert alert-light border">Loading dashboard...</div> : stats && (
          <div className="row g-3 mb-5">
            {statCards.map(([key, label]) => <div className="col-sm-6 col-lg-3" key={key}><div className="card shadow-sm h-100"><div className="card-body"><div className="small text-muted">{label}</div><div className="display-6 text-primary">{stats[key]}</div></div></div></div>)}
          </div>
        )}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button className="btn btn-primary" onClick={() => navigate("/admin")}>Dashboard</button>
          <button className="btn btn-outline-primary" onClick={() => navigate("/admin/audit-logs")}>Audit logs</button>
          <button className="btn btn-outline-primary" onClick={() => document.getElementById("admin-users")?.scrollIntoView({ behavior: "smooth" })}>Users</button>
          <button className="btn btn-outline-primary" onClick={() => { setFilters({ ...filters, role: "DOCTOR" }); document.getElementById("admin-users")?.scrollIntoView({ behavior: "smooth" }); }}>Doctors</button>
          <button className="btn btn-outline-primary" onClick={() => navigate("/department")}>Departments</button>
          <button className="btn btn-outline-primary" onClick={() => document.getElementById("admin-appointments")?.scrollIntoView({ behavior: "smooth" })}>Appointments</button>
          <button className="btn btn-outline-primary" onClick={() => document.getElementById("admin-emergencies")?.scrollIntoView({ behavior: "smooth" })}>Emergency requests</button>
        </div>
        <div id="admin-appointments" className="alert alert-light border">Appointment administration is available through the protected <code>GET /api/appointments</code> and status-management APIs.</div>
        <div id="admin-emergencies" className="alert alert-light border">Emergency administration is available through the protected <code>GET /api/emergencies</code> and status-management APIs.</div>
        <section id="admin-users" className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5">User management</h2>
            <div className="row g-2 mb-3">
              <div className="col-md-5"><input className="form-control" placeholder="Search name or email" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></div>
              <div className="col-md-3"><select className="form-select" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}><option value="">All roles</option><option>PATIENT</option><option>DOCTOR</option><option>ADMIN</option></select></div>
              <div className="col-md-3"><select className="form-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              <div className="col-md-1"><button className="btn btn-primary w-100" onClick={() => loadUsers(1)}>Go</button></div>
            </div>
            {usersLoading ? <p>Loading users...</p> : users.length === 0 ? <div className="alert alert-light border">No users match the selected filters.</div> : (
              <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th><th /></tr></thead><tbody>{users.map((user) => <tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td><span className={`badge ${user.isActive ? "text-bg-success" : "text-bg-secondary"}`}>{user.isActive ? "Active" : "Inactive"}</span></td><td>{new Date(user.createdAt).toLocaleDateString()}</td><td><button className="btn btn-sm btn-outline-secondary" onClick={() => updateStatus(user)}>{user.isActive ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table></div>
            )}
            {pagination.pages > 1 && <div className="d-flex justify-content-between align-items-center"><button className="btn btn-sm btn-outline-primary" disabled={pagination.page <= 1} onClick={() => loadUsers(pagination.page - 1)}>Previous</button><span>Page {pagination.page} of {pagination.pages}</span><button className="btn btn-sm btn-outline-primary" disabled={!pagination.hasNextPage} onClick={() => loadUsers(pagination.page + 1)}>Next</button></div>}
          </div>
        </section>
      </main>
    </>
  );
}

export default function AdminDashboard() {
  return <ProtectedRoute roles={["ADMIN"]}><AdminDashboardContent /></ProtectedRoute>;
}
