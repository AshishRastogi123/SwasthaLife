import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Department = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const departments = [
    {
      name: "Family Medicine",
      icon: "fas fa-user-md",
      description: "Comprehensive healthcare for the entire family, from preventive care to chronic disease management.",
      services: ["Annual check-ups", "Vaccinations", "Chronic disease management", "Preventive screenings"]
    },
    {
      name: "Female Health",
      icon: "fas fa-female",
      description: "Specialized care for women's health needs throughout all life stages.",
      services: ["Gynecological exams", "Prenatal care", "Menopause management", "Breast health"]
    },
    {
      name: "Optician",
      icon: "fas fa-eye",
      description: "Complete eye care services including vision testing, eyewear fitting, and eye health monitoring.",
      services: ["Vision exams", "Eyewear prescription", "Contact lens fitting", "Eye disease screening"]
    },
    {
      name: "Cardiology",
      icon: "fas fa-heartbeat",
      description: "Advanced cardiac care with state-of-the-art diagnostics and treatment options.",
      services: ["ECG/EKG", "Stress testing", "Heart disease prevention", "Cardiac rehabilitation"]
    },
    {
      name: "Dermatology",
      icon: "fas fa-allergies",
      description: "Comprehensive skin care including medical dermatology and cosmetic procedures.",
      services: ["Acne treatment", "Skin cancer screening", "Cosmetic procedures", "Allergy testing"]
    },
    {
      name: "Pediatrics",
      icon: "fas fa-child",
      description: "Specialized medical care for infants, children, and adolescents.",
      services: ["Well-child visits", "Immunizations", "Developmental screenings", "Sick child care"]
    }
  ];

  return (
    <>
      <Navbar />
      <div style={{ fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif" }}>
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
              className="display-4 fw-bold mb-4"
              style={{ color: "#2563eb" }}
            >
              Our Departments
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.2rem", color: "#374151" }}
            >
              Comprehensive healthcare services tailored to meet all your medical needs.
            </motion.p>
          </div>
        </motion.section>

        {/* Departments Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="departments-section py-5"
          style={{
            background: "#ffffff",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <div className="row">
              {departments.map((dept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="col-lg-4 col-md-6 mb-4"
                >
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{
                      background: "#ffffff",
                      borderRadius: "15px",
                      padding: "30px 20px",
                      textAlign: "center",
                      border: "1px solid #e5e7eb"
                    }}
                  >
                    <motion.i
                      whileHover={{ scale: 1.1 }}
                      className={`${dept.icon} fa-3x mb-3`}
                      style={{ color: "#10b981" }}
                    ></motion.i>
                    <h5 className="card-title fw-bold mb-3" style={{ color: "#2563eb" }}>
                      {dept.name}
                    </h5>
                    <p className="card-text mb-3" style={{ color: "#374151", fontSize: "0.95rem" }}>
                      {dept.description}
                    </p>
                    <div className="services-list">
                      <h6 style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "10px" }}>
                        Services Include:
                      </h6>
                      <ul className="list-unstyled" style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                        {dept.services.map((service, idx) => (
                          <li key={idx} className="mb-1">
                            <i className="fas fa-check-circle me-2" style={{ color: "#10b981", fontSize: "0.7rem" }}></i>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn mt-3"
                      style={{
                        background: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "25px",
                        padding: "8px 20px"
                      }}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="why-choose-section py-5"
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center h1 fw-bold mb-5"
              style={{ color: "#2563eb" }}
            >
              Why Choose Our Departments?
            </motion.h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-user-md",
                  title: "Expert Specialists",
                  description: "Our departments are led by board-certified specialists with years of experience."
                },
                {
                  icon: "fas fa-microscope",
                  title: "Advanced Technology",
                  description: "State-of-the-art equipment and cutting-edge medical technology for accurate diagnoses."
                },
                {
                  icon: "fas fa-clock",
                  title: "24/7 Care",
                  description: "Round-the-clock emergency services and urgent care when you need it most."
                },
                {
                  icon: "fas fa-heart",
                  title: "Patient-Centered Care",
                  description: "Personalized treatment plans tailored to your unique health needs and preferences."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="col-lg-3 col-md-6 mb-4"
                >
                  <div className="text-center">
                    <motion.i
                      whileHover={{ scale: 1.1 }}
                      className={`${feature.icon} fa-3x mb-3`}
                      style={{ color: "#10b981" }}
                    ></motion.i>
                    <h5 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                      {feature.title}
                    </h5>
                    <p style={{ color: "#374151", fontSize: "0.95rem" }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="cta-section py-5"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
            color: "#ffffff",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="h1 fw-bold mb-4"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lead mb-4"
              style={{ fontSize: "1.2rem" }}
            >
              Schedule an appointment with one of our specialized departments today.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-light btn-lg me-3"
              style={{
                borderRadius: "25px",
                padding: "12px 30px",
                fontWeight: "bold"
              }}
            >
              <i className="fas fa-calendar-alt me-2"></i>
              Book Appointment
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-outline-light btn-lg"
              style={{
                borderRadius: "25px",
                padding: "12px 30px",
                fontWeight: "bold"
              }}
            >
              <i className="fas fa-phone me-2"></i>
              Call Now
            </motion.button>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default Department;
