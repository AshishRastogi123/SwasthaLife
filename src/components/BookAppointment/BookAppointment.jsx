import React, { useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    date: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Appointment request submitted successfully!");
    console.log("Appointment Data:", formData);
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      date: "",
      message: "",
    });
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif",
        }}
      >
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
          className="hero-section py-5"
          style={{
            background: "linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)",
            color: "#1e293b",
            textAlign: "center",
            padding: "80px 20px",
            marginTop: "76px",
          }}
        >
          <div className="container">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="display-5 fw-bold mb-4"
              style={{ color: "#2563eb" }}
            >
              Book Your Appointment
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.2rem", color: "#374151" }}
            >
              Schedule your health check-up with our specialized departments
              easily and securely.
            </motion.p>
          </div>
        </motion.section>

        {/* Appointment Form Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
          className="appointment-section py-5"
          style={{ background: "#ffffff", padding: "60px 20px" }}
        >
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-5"
            >
              <h2 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                Appointment Form
              </h2>
              <p className="text-muted" style={{ fontSize: "1rem" }}>
                Fill in the form below, and our team will contact you soon to
                confirm your appointment.
              </p>
            </motion.div>

            <div className="row justify-content-center">
              <div className="col-lg-8">
                <form
                  className="p-4 border rounded-3 shadow-sm bg-light"
                  onSubmit={handleSubmit}
                >
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Select Department
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">Choose...</option>
                        <option value="Family Medicine">Family Medicine</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Optician">Optician</option>
                        <option value="Female Health">Female Health</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Additional Message
                      </label>
                      <input
                        type="text"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="btn btn-primary px-5 py-2 fw-semibold"
                      style={{
                        background: "#2563eb",
                        border: "none",
                        borderRadius: "25px",
                      }}
                    >
                      Book Appointment
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Info Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="contact-section py-5"
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <div className="container">
            <h3 className="fw-bold mb-4" style={{ color: "#2563eb" }}>
              Need Assistance?
            </h3>
            <p className="text-muted mb-3" style={{ fontSize: "1rem" }}>
              Our team is here to help! Reach out to us through the following
              contact details:
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-4 mt-4">
              <div>
                <i
                  className="fas fa-phone fa-lg me-2"
                  style={{ color: "#10b981" }}
                ></i>
                <span className="fw-semibold text-dark">
                  <a
                    href="tel:+918445631880"
                    className="text-black text-decoration-none"
                  >
                    +91 84456 31880
                  </a>
                  ,{" "}
                  <a
                    href="tel:+919756021146"
                    className="text-black text-decoration-none"
                  >
                    +91 79004 04660
                  </a>
                </span>
              </div>

              <div>
                <i
                  className="fas fa-envelope fa-lg me-2"
                  style={{ color: "#10b981" }}
                ></i>
                <span className="fw-semibold text-dark">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@swasthalife.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#000906ff", textDecoration: "none" }}
                  >
                    info@swasthalife.org
                  </a>
                </span>
              </div>

              <div>
                <a
                  href="https://www.google.com/maps/place/Invertis+University,+Bareilly+-Top+University+In+Uttar+Pradesh+(U.P)/@28.2919024,79.4569444,4992m/data=!3m1!1e3!4m10!1m2!2m1!1sInvertis+Village+Bareilly+UP!3m6!1s0x39a0023f8a1f8cdd:0x5b10af261bf34c99!8m2!3d28.2919024!4d79.4929933!15sChxJbnZlcnRpcyBWaWxsYWdlIEJhcmVpbGx5IFVQkgEKdW5pdmVyc2l0eaoBXwoKL20vMHRrZzNmMRABKgwiCGludmVydGlzKAAyHxABIhu3wKq4PD62dhSgvS-S4QNjomrYoSWdR9TfpuAyIBACIhxpbnZlcnRpcyB2aWxsYWdlIGJhcmVpbGx5IHVw4AEA!16s%2Fm%2F0tkg3f1?entry=ttu&g_ep=EgoyMDI1MTExMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "1.5rem",
                  }}
                >
                  <i
                    className="fas fa-map-marker-alt fa-lg me-2"
                    style={{ color: "#10b981" }}
                  ></i>
                </a>
                <span className="fw-semibold text-dark">
                  Invertis University Bareilly, Uttar Pradesh, India
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default BookAppointment;
