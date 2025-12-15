import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const HeartScience = () => {
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
              HeartScience & Cardiology Care
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.1rem", color: "#374151" }}
            >
              Advanced heart check-ups, heart disease care, and preventive
              cardiac health support.
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
                  About Our HeartScience Department
                </h2>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Our HeartScience & Cardiology department focuses on complete
                  heart health — from simple heart check-ups to advanced
                  treatment of heart diseases. We provide ECG, echo tests,
                  stress tests, and monitoring for blood pressure, cholesterol,
                  and other heart risk factors.
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Whether you feel chest discomfort, shortness of breath, or
                  have a history of heart problems, our heart specialists help
                  you with early detection, proper diagnosis, and long-term
                  heart care.
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
                    ECG, Echo & Stress Test (TMT)
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Heart attack risk assessment & prevention plans
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Blood pressure & cholesterol management
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Post-heart-attack recovery & follow-up care
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
                    src="https://tse2.mm.bing.net/th/id/OIP.QwZk2CN8wF5_m0NVBMGggAHaGD?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
                    alt="Heart checkup"
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

        {/* Why Heart Care is Important */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{ background: "#fee2e2", padding: "60px 20px" }}
        >
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-6 mb-4">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#2563eb" }}>
                  Why Heart Care Matters
                </h2>
                <p
                  style={{
                    fontSize: "0.98rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Heart disease is one of the most common health problems today.
                  Many times, heart issues start slowly and show very mild
                  symptoms like tiredness, mild chest discomfort, or breath
                  shortness. Regular heart check-ups can help catch problems
                  early — before they become serious.
                </p>
                <p
                  style={{
                    fontSize: "0.98rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  With busy lifestyle, stress, irregular sleep, junk food, and
                  lack of exercise, your heart needs extra care. Early
                  detection, proper guidance, and lifestyle changes can save
                  you from major heart problems in the future.
                </p>
              </div>

              <div className="col-lg-6 mb-4">
                <h4 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                  When Should You Visit a Heart Specialist?
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
                    Chest pain, pressure, or heaviness (especially on walking)
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Shortness of breath on climbing stairs or small activity
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Fast or irregular heartbeat, palpitations, or dizziness
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    High blood pressure, high cholesterol, or diabetes history
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Family history of heart attack or sudden death
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Heart Care for All Ages */}
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
              Heart Care for Every Age Group
            </h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-child",
                  title: "Young Adults",
                  text: "Stress, lack of sleep, smoking, and junk food can silently affect heart health. Early lifestyle care is very important.",
                },
                {
                  icon: "fas fa-user",
                  title: "Middle Age",
                  text: "High BP, diabetes, and cholesterol are more common. Regular check-ups help prevent future heart attacks.",
                },
                {
                  icon: "fas fa-user-clock",
                  title: "Seniors",
                  text: "Age-related heart problems, heart failure, and rhythm issues need regular monitoring and medications.",
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

        {/* Common Heart Conditions */}
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
              Common Heart Conditions We Manage
            </h2>
            <p
              className="text-center mb-4"
              style={{
                fontSize: "0.95rem",
                color: "#374151",
              }}
            >
              Our cardiology experts diagnose and treat a wide range of heart
              and blood vessel problems.
            </p>
            <div className="row">
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• High blood pressure (Hypertension)</li>
                  <li className="mb-2">• High cholesterol</li>
                  <li className="mb-2">• Angina (chest pain)</li>
                  <li className="mb-2">• Coronary artery disease</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Heart attack</li>
                  <li className="mb-2">• Heart failure</li>
                  <li className="mb-2">• Irregular heartbeat (Arrhythmia)</li>
                  <li className="mb-2">• Valve problems</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Congenital heart disease</li>
                  <li className="mb-2">• Post-surgery follow-up</li>
                  <li className="mb-2">• Heart disease with diabetes</li>
                  <li className="mb-2">• Blood clot related conditions</li>
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
              How SwasthaLife Supports Heart Health
            </h2>
            <p
              className="mb-4"
              style={{
                fontSize: "1rem",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              With AI-based risk prediction, lifestyle tracking, and easy
              follow-up tools, SwasthaLife helps you understand your heart
              status and take the right steps at the right time.
            </p>
            <p style={{ fontSize: "0.95rem", opacity: 0.9 }}>
              Early risk detection • Smart heart monitoring • Better lifestyle
              guidance — all in one connected system.
            </p>
          </div>
        </motion.section>
      </div>

      <Footer />
    </>
  );
};

export default HeartScience;