import { motion as Motion } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./AuthResponsive.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const submittingRef = useRef(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    // Clear error for this field when user starts typing
    if (error[name]) {
      setError({ ...error, [name]: "" });
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Email validation
    if (!data.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!validateForm()) {
      return;
    }

    try {
      submittingRef.current = true;
      setLoading(true);
      const user = await login({ email: data.email, password: data.password });
      toast.success("Login successful.");
      const returnTo = location.state?.from;
      const defaultPath = user.role === "DOCTOR"
        ? "/doctor-dashboard"
        : user.role === "ADMIN"
          ? "/admin"
          : "/";
      navigate(
        typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//")
          ? returnTo
          : defaultPath,
        { replace: true }
      );
    } catch (loginError) {
      setError((current) => ({ ...current, form: loginError.message || "Unable to sign in. Please try again." }));
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} sign-in is not available yet.`);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const leftPanelVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, delay: 0.2 } },
  };

  const rightPanelVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, delay: 0.4 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Motion.div
      className="auth-page d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #E3F2FD, #FCE4EC)",
        minHeight: "100vh",
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container">
        <div className="row justify-content-center">
          <Motion.div
            className="auth-intro-panel col-12 col-lg-5 d-flex flex-column align-items-center justify-content-center text-center bg-white shadow rounded-start p-4"
            variants={leftPanelVariants}
            initial="hidden"
            animate="visible"
            style={{ minHeight: "500px" }}
          >
            <Motion.h4
              className="fw-bold mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              An easy way to manage
            </Motion.h4>
            <Motion.h2
              className="fw-bold text-primary mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Your Health Online
            </Motion.h2>
            <Motion.img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
              alt="health"
              style={{ width: "80%", maxWidth: "250px" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            />
            <Motion.a
              href="/"
              className="mt-4 text-decoration-none fw-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Go back to Home
            </Motion.a>
          </Motion.div>

          <Motion.div
            className="auth-form-panel col-12 col-lg-5 bg-light shadow rounded-end p-4"
            variants={rightPanelVariants}
            initial="hidden"
            animate="visible"
            style={{ minHeight: "500px" }}
          >
            <Motion.h4
              className="text-center fw-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Welcome to SwasthaLife Portal
            </Motion.h4>

            {/* Form Error Display */}
            {error.form && (
              <Motion.div
                className="alert alert-danger alert-dismissible fade show mb-3"
                role="alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error.form}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError({ ...error, form: "" })}
                ></button>
              </Motion.div>
            )}

            <form onSubmit={handleLogin}>
              <Motion.div
                className="mb-3"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`form-control ${error.email ? "is-invalid" : ""}`}
                  value={data.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />
                {error.email && (
                  <div className="invalid-feedback">{error.email}</div>
                )}
              </Motion.div>

              <Motion.div
                className="mb-4"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1 }}
              >
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className={`form-control ${error.password ? "is-invalid" : ""}`}
                    value={data.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary position-absolute end-0 top-0 h-100"
                    style={{ 
                      border: "none", 
                      background: "transparent",
                      padding: "0 15px"
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
                {error.password && (
                  <div className="invalid-feedback">{error.password}</div>
                )}
              </Motion.div>

              <Motion.div
                className="d-grid mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <Motion.button
                  type="submit"
                  className="btn btn-primary fw-semibold py-2"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Motion.button>
              </Motion.div>

              <div className="text-end mb-4">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
            </form>

            <Motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            />
            
            <Motion.p
              className="text-center text-muted my-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              Or Login with
            </Motion.p>

            <Motion.div
              className="d-flex justify-content-center gap-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <Motion.button
                type="button"
                className="btn btn-outline-primary btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("facebook")}
                disabled={loading}
              >
                <i className="bi bi-facebook me-1"></i> Facebook
              </Motion.button>
              <Motion.button
                type="button"
                className="btn btn-outline-info btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("twitter")}
                disabled={loading}
              >
                <i className="bi bi-twitter me-1"></i> Twitter
              </Motion.button>
              <Motion.button
                type="button"
                className="btn btn-outline-primary btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("linkedin")}
                disabled={loading}
              >
                <i className="bi bi-linkedin me-1"></i> LinkedIn
              </Motion.button>
              <Motion.button
                type="button"
                className="btn btn-outline-danger btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
              >
                <i className="bi bi-google me-1"></i> Google
              </Motion.button>
            </Motion.div>

            <Motion.div
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              <p className="mb-0">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-decoration-none fw-semibold"
                  style={{ color: "#0d6efd" }}
                >
                  Register Now
                </Link>
              </p>
              <p className="text-muted small mt-2">
                By logging in, you agree to our <Link to="/terms">Terms of Service</Link> and acknowledge our <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </Motion.div>
          </Motion.div>
        </div>
      </div>
    </Motion.div>
  );
}

export default Login;