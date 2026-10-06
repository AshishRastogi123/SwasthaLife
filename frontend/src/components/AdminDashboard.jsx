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
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [departmentForm, setDepartmentForm] = useState({ name: "", description: "" });
  const [editingDepartmentId, setEditingDepartmentId] = useState("");
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "PATIENT",
    departmentId: "",
    licenseNumber: "",
    qualifications: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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

  const loadDepartments = useCallback(async () => {
    const result = await apiRequest("/api/departments/manage");
    setDepartments(result.data || []);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadStats(), loadUsers(), loadDepartments()]);
    } catch (loadError) {
      if (loadError.message.includes("Unauthorized") || loadError.message.includes("Forbidden")) navigate("/login");
      else setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [loadStats, loadUsers, loadDepartments, navigate]);

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

  const saveDepartment = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const isEditing = Boolean(editingDepartmentId);
      const result = await apiRequest(
        isEditing ? `/api/departments/${editingDepartmentId}` : "/api/departments",
        {
          method: isEditing ? "PATCH" : "POST",
          body: JSON.stringify(departmentForm),
        }
      );
      setDepartments((current) => {
        const updated = current.filter((item) => item._id !== result.data._id);
        return [...updated, result.data].sort((left, right) => left.name.localeCompare(right.name));
      });
      setDepartmentForm({ name: "", description: "" });
      setEditingDepartmentId("");
      setNotice(isEditing ? "Department updated." : "Department added.");
      await loadStats();
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const deleteDepartment = async (department) => {
    if (!window.confirm(`Deactivate ${department.name}? Existing doctor and appointment records will be retained.`)) return;
    setError("");
    setNotice("");
    try {
      const result = await apiRequest(`/api/departments/${department._id}`, { method: "DELETE" });
      setDepartments((current) => current.map((item) => item._id === department._id ? result.data : item));
      setNotice("Department deactivated. Existing records have been retained.");
      await loadStats();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const updateDepartmentStatus = async (department) => {
    setError("");
    setNotice("");
    try {
      const result = await apiRequest(`/api/departments/${department._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !department.isActive }),
      });
      setDepartments((current) => current.map((item) => item._id === department._id ? result.data : item));
      setNotice(result.data.isActive ? "Department reactivated." : "Department deactivated.");
      await loadStats();
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  const createManagedUser = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (userForm.password !== userForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const result = await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          password: userForm.password,
          role: userForm.role,
          ...(userForm.role === "DOCTOR" && {
            departmentId: userForm.departmentId,
            licenseNumber: userForm.licenseNumber,
            qualifications: userForm.qualifications.split(",").map((item) => item.trim()).filter(Boolean),
            bio: userForm.bio,
          }),
        }),
      });
      setUserForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "PATIENT",
        departmentId: "",
        licenseNumber: "",
        qualifications: "",
        bio: "",
      });
      setNotice(`${result.data.role === "DOCTOR" ? "Doctor" : "User"} account created.`);
      await Promise.all([loadUsers(1), loadStats()]);
    } catch (createError) {
      setError(createError.message);
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
        {notice && <div className="alert alert-success" role="status">{notice}</div>}
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
          <button className="btn btn-outline-primary" onClick={() => document.getElementById("admin-departments")?.scrollIntoView({ behavior: "smooth" })}>Departments</button>
          <button className="btn btn-outline-primary" onClick={() => document.getElementById("admin-appointments")?.scrollIntoView({ behavior: "smooth" })}>Appointments</button>
          <button className="btn btn-outline-primary" onClick={() => document.getElementById("admin-emergencies")?.scrollIntoView({ behavior: "smooth" })}>Emergency requests</button>
        </div>
        <div id="admin-appointments" className="alert alert-light border">Appointment administration is available through the protected <code>GET /api/appointments</code> and status-management APIs.</div>
        <div id="admin-emergencies" className="alert alert-light border">Emergency administration is available through the protected <code>GET /api/emergencies</code> and status-management APIs.</div>
        <section id="admin-departments" className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h5">Department management</h2>
            <form className="row g-2 mb-4" onSubmit={saveDepartment}>
              <div className="col-md-4">
                <label className="form-label" htmlFor="department-name">Department name</label>
                <input id="department-name" className="form-control" required value={departmentForm.name} onChange={(event) => setDepartmentForm({ ...departmentForm, name: event.target.value })} />
              </div>
              <div className="col-md-5">
                <label className="form-label" htmlFor="department-description">Description</label>
                <input id="department-description" className="form-control" value={departmentForm.description} onChange={(event) => setDepartmentForm({ ...departmentForm, description: event.target.value })} />
              </div>
              <div className="col-md-3 d-flex align-items-end gap-2">
                <button className="btn btn-primary" type="submit">{editingDepartmentId ? "Save changes" : "Add department"}</button>
                {editingDepartmentId && <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingDepartmentId(""); setDepartmentForm({ name: "", description: "" }); }}>Cancel</button>}
              </div>
            </form>
            {departments.length === 0 ? <p className="text-muted mb-0">No departments have been created.</p> : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead><tr><th>Department</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {departments.map((department) => (
                      <tr key={department._id}>
                        <td>{department.name}</td>
                        <td>{department.description || "—"}</td>
                        <td><span className={`badge ${department.isActive ? "text-bg-success" : "text-bg-secondary"}`}>{department.isActive ? "Active" : "Inactive"}</span></td>
                        <td className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => { setEditingDepartmentId(department._id); setDepartmentForm({ name: department.name, description: department.description || "" }); }}>Edit</button>
                          {department.isActive
                            ? <button className="btn btn-sm btn-outline-danger" onClick={() => deleteDepartment(department)}>Delete</button>
                            : <button className="btn btn-sm btn-outline-success" onClick={() => updateDepartmentStatus(department)}>Reactivate</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
        <section id="admin-create-user" className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h5">Add a user or doctor</h2>
            <p className="text-muted small">Doctor accounts are linked to a department and receive a doctor profile. Admin accounts cannot be created here.</p>
            <form className="row g-3" onSubmit={createManagedUser}>
              <div className="col-md-4"><label className="form-label" htmlFor="managed-name">Full name</label><input id="managed-name" className="form-control" required value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })} /></div>
              <div className="col-md-4"><label className="form-label" htmlFor="managed-email">Email</label><input id="managed-email" type="email" className="form-control" required value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} /></div>
              <div className="col-md-4"><label className="form-label" htmlFor="managed-phone">Phone</label><input id="managed-phone" type="tel" className="form-control" value={userForm.phone} onChange={(event) => setUserForm({ ...userForm, phone: event.target.value })} /></div>
              <div className="col-md-4"><label className="form-label" htmlFor="managed-password">Temporary password</label><input id="managed-password" type="password" minLength={8} className="form-control" required value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} /></div>
              <div className="col-md-4"><label className="form-label" htmlFor="managed-confirm-password">Confirm password</label><input id="managed-confirm-password" type="password" minLength={8} className="form-control" required value={userForm.confirmPassword} onChange={(event) => setUserForm({ ...userForm, confirmPassword: event.target.value })} /></div>
              <div className="col-md-4"><label className="form-label" htmlFor="managed-role">Account type</label><select id="managed-role" className="form-select" value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}><option value="PATIENT">Patient</option><option value="DOCTOR">Doctor</option></select></div>
              {userForm.role === "DOCTOR" && (
                <>
                  <div className="col-md-4"><label className="form-label" htmlFor="managed-department">Department</label><select id="managed-department" className="form-select" required value={userForm.departmentId} onChange={(event) => setUserForm({ ...userForm, departmentId: event.target.value })}><option value="">Select department</option>{departments.filter((department) => department.isActive).map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select></div>
                  <div className="col-md-4"><label className="form-label" htmlFor="managed-license">Medical license number</label><input id="managed-license" className="form-control" required value={userForm.licenseNumber} onChange={(event) => setUserForm({ ...userForm, licenseNumber: event.target.value })} /></div>
                  <div className="col-md-4"><label className="form-label" htmlFor="managed-qualifications">Qualifications</label><input id="managed-qualifications" className="form-control" placeholder="Comma-separated (optional)" value={userForm.qualifications} onChange={(event) => setUserForm({ ...userForm, qualifications: event.target.value })} /></div>
                  <div className="col-12"><label className="form-label" htmlFor="managed-bio">Doctor bio</label><textarea id="managed-bio" className="form-control" rows="2" value={userForm.bio} onChange={(event) => setUserForm({ ...userForm, bio: event.target.value })} /></div>
                </>
              )}
              <div className="col-12"><button className="btn btn-primary" type="submit">Create {userForm.role === "DOCTOR" ? "doctor" : "user"} account</button></div>
            </form>
          </div>
        </section>
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
