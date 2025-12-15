import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const ChildHealthServices = () => {
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
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #dbeafe 0%, #fee2e2 100%)",
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
              className="display-4 fw-bold mb-3"
              style={{ color: "#2563eb" }}
            >
              Child Health & Pediatrics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.1rem", color: "#374151" }}
            >
              Safe, gentle, and complete healthcare for babies, children, and teenagers.
            </motion.p>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{ background: "#ffffff", padding: "60px 20px" }}
        >
          <div className="container">
            <div className="row align-items-center">
              {/* Left Text */}
              <div className="col-lg-7 mb-4 mb-lg-0">
                <h2 className="h1 fw-bold mb-4" style={{ color: "#2563eb" }}>
                  About Our Child Health Services
                </h2>
                <p
                  style={{ fontSize: "1rem", color: "#374151", lineHeight: "1.7" }}
                >
                  Our Pediatrics Department takes care of children’s health from birth to 18 years.
                  We focus on growth, nutrition, immunity, behavior, and early detection of illnesses.
                </p>
                <p
                  style={{ fontSize: "1rem", color: "#374151", lineHeight: "1.7" }}
                >
                  From routine vaccinations to fever, cough, infections, allergies, and development check-ups,
                  our child specialists make sure your child stays healthy, active, and happy.
                </p>

                <h4 className="fw-bold mt-4 mb-3" style={{ color: "#2563eb" }}>
                  Key Services
                </h4>
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  <li className="mb-2">
                    <i className="fas fa-check-circle me-2" style={{ color: "#10b981" }}></i>
                    Newborn and infant check-ups
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle me-2" style={{ color: "#10b981" }}></i>
                    Vaccination & immunization schedule
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle me-2" style={{ color: "#10b981" }}></i>
                    Fever, cough, cold & infection treatment
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle me-2" style={{ color: "#10b981" }}></i>
                    Growth, nutrition & development monitoring
                  </li>
                </ul>
              </div>

              {/* Right Image */}
              <div className="col-lg-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-center"
                >
                  <img
                    src="https://media.istockphoto.com/photos/pediatrician-picture-id514836214?k=6&m=514836214&s=612x612&w=0&h=1ngpHWupr872Mp7wIR3ewjIP3DANmxAy6eJtOPoQ0iw="
                    alt="Child Checkup"
                    className="img-fluid rounded shadow"
                    style={{ maxWidth: "100%", height: "auto", objectFit: "cover" }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Why Child Health Matters */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{ background: "#eff6ff", padding: "60px 20px" }}
        >
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-6 mb-4">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#2563eb" }}>
                  Why Child Health Care is Important
                </h2>
                <p
                  style={{ fontSize: "0.98rem", color: "#374151", lineHeight: "1.7" }}
                >
                  Childhood is the most important phase for growth and immunity. 
                  Proper nutrition, timely vaccinations, and regular health check-ups
                  help prevent many serious illnesses in later life.
                </p>
                <p
                  style={{ fontSize: "0.98rem", color: "#374151", lineHeight: "1.7" }}
                >
                  Many health issues like asthma, allergies, vision problems, learning difficulties, 
                  and weak immunity can be controlled early if parents stay alert and consult a pediatric doctor on time.
                </p>
              </div>

              <div className="col-lg-6 mb-4">
                <h4 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                  When Should You Visit the Child Specialist?
                </h4>
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  <li className="mb-2">
                    <i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Regular vaccinations and growth follow-ups
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Fever, cold, cough, vomiting, or loose motions
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Child not eating properly or low weight
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Breathing difficulty, wheezing, or repeated chest infection
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Behaviour or learning issues noticed at school or home
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Child Care by Age Group */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #eef2ff 0%, #fee2e2 100%)",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <h2
              className="text-center h3 fw-bold mb-5"
              style={{ color: "#2563eb" }}
            >
              Child Care for Every Age Group
            </h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-baby",
                  title: "Babies (0–2 years)",
                  text: "Breastfeeding guidance, vaccination, weight gain, sleep patterns, and early development.",
                },
                {
                  icon: "fas fa-child",
                  title: "Young Children (3–10 years)",
                  text: "Nutrition, infections, school health, behavior, and immunity building.",
                },
                {
                  icon: "fas fa-user-graduate",
                  title: "Teenagers (11–18 years)",
                  text: "Hormonal changes, height & weight, stress, screen-time, and mental well-being.",
                },
              ].map((item, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{
                      borderRadius: "15px",
                      padding: "25px 20px",
                      textAlign: "center",
                      background: "#ffffff",
                    }}
                  >
                    <i
                      className={`${item.icon} fa-3x mb-3`}
                      style={{ color: "#2563eb" }}
                    ></i>
                    <h5 className="fw-bold mb-2" style={{ color: "#2563eb" }}>
                      {item.title}
                    </h5>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: "#374151",
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Common Child Conditions */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{ background: "#ffffff", padding: "60px 20px" }}
        >
          <div className="container">
            <h2
              className="h3 fw-bold mb-4 text-center"
              style={{ color: "#2563eb" }}
            >
              Common Child Health Conditions We Manage
            </h2>
            <p
              className="text-center mb-4"
              style={{
                fontSize: "0.95rem",
                color: "#374151",
              }}
            >
              Our pediatric doctors handle day-to-day illnesses as well as long-term health conditions in children.
            </p>
            <div className="row">
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Fever, viral infections, flu</li>
                  <li className="mb-2">• Cough, cold & throat infection</li>
                  <li className="mb-2">• Loose motions & vomiting</li>
                  <li className="mb-2">• Ear and eye infections</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Asthma & breathing problems</li>
                  <li className="mb-2">• Allergies & skin rashes</li>
                  <li className="mb-2">• Underweight or overweight issues</li>
                  <li className="mb-2">• Nutritional deficiencies (iron, vitamin)</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Delayed milestones</li>
                  <li className="mb-2">• Learning / attention problems</li>
                  <li className="mb-2">• Behavioral & sleep issues</li>
                  <li className="mb-2">• Chronic conditions (diabetes, epilepsy)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
            color: "#ffffff",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <h2 className="h3 fw-bold mb-3">
              How SwasthaLife Supports Child Health
            </h2>
            <p
              className="mb-4"
              style={{
                fontSize: "1rem",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              With smart reminders for vaccination, symptom tracking, growth charts, and AI-based risk alerts,
              SwasthaLife helps parents take better care of their child’s health.
            </p>
            <p style={{ fontSize: "0.95rem", opacity: 0.9 }}>
              Healthy growth • Strong immunity • Happy childhood — all in one connected system.
            </p>
          </div>
        </motion.section>
      </div>

      <Footer />
    </>
  );
};

export default ChildHealthServices;