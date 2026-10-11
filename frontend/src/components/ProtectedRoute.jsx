import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();
  const { user, isLoading, sessionError, refreshSession } = useAuth();

  if (isLoading) {
    return <main className="container py-5 mt-5" role="status">Checking your session...</main>;
  }

  if (sessionError && !user) {
    return (
      <main className="container py-5 mt-5">
        <div className="alert alert-danger" role="alert">{sessionError}</div>
        <button className="btn btn-outline-primary" type="button" onClick={() => refreshSession()}>
          Try again
        </button>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    const homeByRole = {
      PATIENT: "/",
      DOCTOR: "/doctor-dashboard",
      ADMIN: "/admin",
    };
    return <Navigate to={homeByRole[user.role] || "/"} replace />;
  }

  return children;
}
