import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={user.role === "DOCTOR" ? "/doctor-dashboard" : "/dashboard"} replace />;
  }

  return children;
}
