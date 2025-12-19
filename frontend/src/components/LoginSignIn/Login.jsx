import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();

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
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token if available
        if (result.token) {

          localStorage.setItem("token", result.token);
          toast.success("Login successful ");
        }
        
        // Store user data if available
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
          navigate("/");


        }
        
        // Navigate to home page
        
      } else {
        toast.error("Error message");
        setError({ ...error, form: result.message || "Login failed. Please check your credentials." });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError({ ...error, form: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login would be implemented here`);
    // For actual implementation:
    // window.location.href = `http://localhost:3000/api/auth/${provider}`;
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
    <motion.div
      className="vh-100 d-flex justify-content-center align-items-center"
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
          <motion.div
            className="col-md-5 d-flex flex-column align-items-center justify-content-center text-center bg-white shadow rounded-start p-4"
            variants={leftPanelVariants}
            initial="hidden"
            animate="visible"
            style={{ minHeight: "500px" }}
          >
            <motion.h4
              className="fw-bold mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              An easy way to manage
            </motion.h4>
            <motion.h2
              className="fw-bold text-primary mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Your Health Online
            </motion.h2>
            <motion.img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
              alt="health"
              style={{ width: "80%", maxWidth: "250px" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            />
            <motion.a
              href="/"
              className="mt-4 text-decoration-none fw-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Go back to Home
            </motion.a>
          </motion.div>

          <motion.div
            className="col-md-5 bg-light shadow rounded-end p-4"
            variants={rightPanelVariants}
            initial="hidden"
            animate="visible"
            style={{ minHeight: "500px" }}
          >
            <motion.h4
              className="text-center fw-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Welcome to SwasthaLife Portal
            </motion.h4>

            {/* Form Error Display */}
            {error.form && (
              <motion.div
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
              </motion.div>
            )}

            <form onSubmit={handleLogin}>
              <motion.div
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
                  onKeyPress={handleKeyPress}
                  autoComplete="email"
                  disabled={loading}
                />
                {error.email && (
                  <div className="invalid-feedback">{error.email}</div>
                )}
              </motion.div>

              <motion.div
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
                    onKeyPress={handleKeyPress}
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
              </motion.div>

              <motion.div
                className="d-grid mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <motion.button
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
                </motion.button>
              </motion.div>

              <div className="text-end mb-4">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
            </form>

            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            />
            
            <motion.p
              className="text-center text-muted my-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              Or Login with
            </motion.p>

            <motion.div
              className="d-flex justify-content-center gap-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <motion.button
                type="button"
                className="btn btn-outline-primary btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("facebook")}
                disabled={loading}
              >
                <i className="bi bi-facebook me-1"></i> Facebook
              </motion.button>
              <motion.button
                type="button"
                className="btn btn-outline-info btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("twitter")}
                disabled={loading}
              >
                <i className="bi bi-twitter me-1"></i> Twitter
              </motion.button>
              <motion.button
                type="button"
                className="btn btn-outline-primary btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("linkedin")}
                disabled={loading}
              >
                <i className="bi bi-linkedin me-1"></i> LinkedIn
              </motion.button>
              <motion.button
                type="button"
                className="btn btn-outline-danger btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
              >
                <i className="bi bi-google me-1"></i> Google
              </motion.button>
            </motion.div>

            <motion.div
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
                By logging in, you agree to our Terms & Privacy Policy
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;