import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
    conPassword: "",
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleValidate = (value) => {
    let errors = {};

    if (!value.email) {
      errors.email = "Email is required";
    }
    if (!value.password) {
      errors.password = "Password is required";
    }
    if (!value.conPassword) {
      errors.conPassword = "Confirm Password is required";
    } else if (value.password !== value.conPassword) {
      errors.conPassword = "Passwords do not match";
    }

    setError(errors);

    if (Object.keys(errors).length === 0) {
      if (
        value.email === "handsometiwariji@gmail.com" &&
        value.password === "Tiwariji123"
      ) {
        alert("Login Successful!");
        navigate("/");
      } else {
        alert("Invalid Email or Password");
      }
    }
  };

  const handleClick = () => {
    handleValidate(data);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };

  const leftPanelVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, delay: 0.2 } }
  };

  const rightPanelVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, delay: 0.4 } }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #E3F2FD, #FCE4EC)",
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
              className="mt-3 text-decoration-none fw-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go back
            </motion.a>
          </motion.div>

          <motion.div
            className="col-md-5 bg-light shadow rounded-end p-4"
            variants={rightPanelVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h4
              className="text-center fw-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Welcome to SwasthaLife Portal
            </motion.h4>

            <motion.div
              className="mb-3"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="form-control"
                onChange={handleChange}
              />
              <p className="text-danger">{error.email}</p>
            </motion.div>

            <motion.div
              className="mb-3"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1 }}
            >
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="form-control"
                onChange={handleChange}
              />
              <p className="text-danger">{error.password}</p>
            </motion.div>

            <motion.div
              className="mb-3"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.2 }}
            >
              <input
                type="password"
                name="conPassword"
                placeholder="Confirm your password"
                className="form-control"
                onChange={handleChange}
              />
              <p className="text-danger">{error.conPassword}</p>
            </motion.div>

            <motion.div
              className="d-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <motion.button
                className="btn btn-primary fw-semibold"
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </motion.div>

            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            />
            <motion.p
              className="text-center text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              Or Login with
            </motion.p>

            <motion.div
              className="d-flex justify-content-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <motion.button
                className="btn btn-outline-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-facebook me-2"></i> Facebook
              </motion.button>
              <motion.button
                className="btn btn-outline-info"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-twitter me-2"></i> Twitter
              </motion.button>
              <motion.button
                className="btn btn-outline-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-linkedin me-2"></i> LinkedIn
              </motion.button>
              <motion.button
                className="btn btn-outline-danger"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-google me-2"></i> Google
              </motion.button>
            </motion.div>

            <motion.div
              className="text-center mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.2 }}
            >
              <p>
                Don't have an account?
                <Link to="/Signup" className="text-decoration-none">
                  Register
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
