import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const FamilyMedicine = () => {
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
              className="display-4 fw-bold mb-3"
              style={{ color: "#2563eb" }}
            >
              Family Medicine
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.1rem", color: "#374151" }}
            >
              Comprehensive healthcare for every member of your family – from
              children to seniors – under one trusted department.
            </motion.p>
          </div>
        </motion.section>

        {/* Main Content Section */}
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
              {/* Left content */}
              <div className="col-lg-7 mb-4 mb-lg-0">
                <h2 className="h1 fw-bold mb-4" style={{ color: "#2563eb" }}>
                  About Family Medicine
                </h2>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Our Family Medicine department focuses on providing
                  continuous, comprehensive care to individuals and families. We
                  look at your overall health, lifestyle, and medical history to
                  create a personalized care plan that fits your daily life.
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Whether it’s routine check-ups, managing chronic conditions
                  like diabetes or hypertension, or preventive screenings, our
                  team ensures that you and your loved ones receive the right
                  care at the right time.
                </p>

                <h4 className="fw-bold mt-4 mb-3" style={{ color: "#2563eb" }}>
                  Key Services
                </h4>
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Annual health check-ups & preventive care
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Vaccinations & immunization schedules
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Chronic disease management (diabetes, BP, etc.)
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Lifestyle counselling & diet guidance
                  </li>
                </ul>
              </div>

              {/* Right image */}
              <div className="col-lg-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-center"
                >
                  <img
                    src="https://tse3.mm.bing.net/th/id/OIP._79XLqexqdex2V3CF278-gHaE8?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
                    alt="Family Medicine"
                    className="img-fluid rounded shadow"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Why Family Medicine Matters */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{ background: "#f9fafb", padding: "60px 20px" }}
        >
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-6 mb-4">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#2563eb" }}>
                  Why Family Medicine Matters
                </h2>
                <p
                  style={{
                    fontSize: "0.98rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Family Medicine is often your first point of contact for
                  health concerns. Instead of visiting different doctors for
                  every small issue, your family physician understands your
                  complete health history, family risks, and lifestyle — making
                  diagnosis faster, safer, and more personalized.
                </p>
                <p
                  style={{
                    fontSize: "0.98rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  With a trusted Family Medicine team, you get consistent care
                  over years, not just one-time treatment. This long-term
                  relationship helps in early detection of health problems and
                  better management of chronic diseases.
                </p>
              </div>

              <div className="col-lg-6 mb-4">
                <h4 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                  When Should You Visit Our Family Medicine Department?
                </h4>
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Routine yearly health check-ups
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Long-term problems like BP, sugar, asthma, thyroid, etc.
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Mild symptoms like fever, cold, cough, body pain
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Guidance on diet, exercise, sleep, and lifestyle
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Regular follow-ups after a major illness or surgery
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Care for Every Age Group */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <h2
              className="text-center h3 fw-bold mb-5"
              style={{ color: "#2563eb" }}
            >
              Care for Every Age Group
            </h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-baby",
                  title: "Children & Teenagers",
                  text: "Growth monitoring, vaccinations, school health, and early detection of developmental issues.",
                },
                {
                  icon: "fas fa-user",
                  title: "Adults",
                  text: "Stress, lifestyle-related conditions, work-life balance, and chronic illness management.",
                },
                {
                  icon: "fas fa-user-clock",
                  title: "Seniors",
                  text: "Age-related health problems, fall prevention, memory care, and regular medication review.",
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
                      style={{ color: "#10b981" }}
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

        {/* Common Conditions We Manage */}
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
              Common Conditions We Manage
            </h2>
            <p
              className="text-center mb-4"
              style={{
                fontSize: "0.95rem",
                color: "#374151",
              }}
            >
              From everyday health concerns to long-term diseases, our Family
              Medicine team is here to support you.
            </p>
            <div className="row">
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Fever, cold, cough, flu</li>
                  <li className="mb-2">• Headache & migraine</li>
                  <li className="mb-2">• Stomach pain & acidity</li>
                  <li className="mb-2">• Minor infections</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Diabetes & blood pressure</li>
                  <li className="mb-2">• Thyroid problems</li>
                  <li className="mb-2">• Joint pain & back pain</li>
                  <li className="mb-2">• Allergies & asthma</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Stress & sleep-related issues</li>
                  <li className="mb-2">• Weight management</li>
                  <li className="mb-2">• Lifestyle & diet counselling</li>
                  <li className="mb-2">
                    • Follow-up care after hospital discharge
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA / How SwasthaLife Helps */}
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
              How SwasthaLife Supports Your Family
            </h2>
            <p
              className="mb-4"
              style={{
                fontSize: "1rem",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              Using AI-powered insights, symptom analysis, and easy access to
              medical departments, SwasthaLife helps your Family Medicine doctor
              make smarter, faster, and more personalized decisions about your
              health.
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                opacity: 0.9,
              }}
            >
              Early detection • Preventive care • Continuous follow-up – all in
              one connected platform.
            </p>
          </div>
        </motion.section>
      </div>

      <Footer />
    </>
  );
};

export default FamilyMedicine;
