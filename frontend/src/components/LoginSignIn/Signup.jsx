import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Signup() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    conPassword: "",
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (values) => {
    const errs = {};
    if (!values.fullname.trim()) errs.fullname = "Full name is required";
    if (!values.email) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "Enter a valid email";
    }
    if (values.phone && !/^[0-9]{10}$/.test(values.phone)) {
      errs.phone = "Enter a valid 10-digit phone number";
    }
    if (!values.password) {
      errs.password = "Password is required";
    } else if (values.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (!values.conPassword) {
      errs.conPassword = "Confirm Password is required";
    } else if (values.password !== values.conPassword) {
      errs.conPassword = "Passwords do not match";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(data);
    setError(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const response = await fetch("http://localhost:3000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.fullname,
            email: data.email,
            password: data.password,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Signup successful! Please login.");
          navigate("/login");
        } else {
          alert(result.message || "Signup failed.");
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    }
  };

  // Reuse the animation variants from your Login page
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
      style={{ background: "linear-gradient(135deg, #E3F2FD, #FCE4EC)" }}
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
              Join SwasthaLife
            </motion.h4>
            <motion.h2
              className="fw-bold text-primary mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Create your account
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
              Go Home
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
              Create a new account
            </motion.h4>

            <form onSubmit={handleSubmit}>
              <motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full name"
                  className="form-control"
                  value={data.fullname}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.fullname}</p>
              </motion.div>

              <motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 1 }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="form-control"
                  value={data.email}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.email}</p>
              </motion.div>

              <motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 1.2 }}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (optional)"
                  className="form-control"
                  value={data.phone}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.phone}</p>
              </motion.div>

              <motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 1.4 }}>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className="form-control"
                  value={data.password}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.password}</p>
              </motion.div>

              <motion.div className="mb-3" variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 1.6 }}>
                <input
                  type="password"
                  name="conPassword"
                  placeholder="Confirm password"
                  className="form-control"
                  value={data.conPassword}
                  onChange={handleChange}
                />
                <p className="text-danger">{error.conPassword}</p>
              </motion.div>

              <motion.div className="d-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.8 }}>
                <motion.button className="btn btn-primary fw-semibold" type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Sign up
                </motion.button>
              </motion.div>
            </form>

            <motion.hr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 2.0 }} />

            <motion.p className="text-center text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 2.2 }}>
              Or continue with
            </motion.p>

            <motion.div className="d-flex justify-content-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 2.4 }}>
              <motion.button className="btn btn-outline-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-facebook me-2"></i> Facebook
              </motion.button>
              <motion.button className="btn btn-outline-info" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-twitter me-2"></i> Twitter
              </motion.button>
              <motion.button className="btn btn-outline-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-linkedin me-2"></i> LinkedIn
              </motion.button>
              <motion.button className="btn btn-outline-danger" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-google me-2"></i> Google
              </motion.button>
            </motion.div>

            <motion.div className="text-center mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 2.6 }}>
              <p>
                Already have an account?
                <Link to="/login" className="text-decoration-none ms-2">Login</Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Signup;