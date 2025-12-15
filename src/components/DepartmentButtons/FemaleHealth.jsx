import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const FemaleHealth = () => {
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
            background: "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%)",
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
              Female Health
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.1rem", color: "#374151" }}
            >
              Dedicated care for women&apos;s health needs – from teenage years
              to motherhood and beyond.
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
                <h2
                  className="h1 fw-bold mb-4"
                  style={{ color: "#2563eb" }}
                >
                  About Female Health Department
                </h2>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Our Female Health department focuses on complete wellness for
                  women at every stage of life. From menstrual health and
                  fertility to pregnancy, menopause, and long-term hormonal
                  balance – we provide sensitive, safe, and personalized care.
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  We understand that women&apos;s bodies and health needs are
                  unique. That&apos;s why our team of gynecologists and
                  specialists spend time listening, understanding, and guiding
                  you with clear, simple, and supportive advice.
                </p>

                <h4
                  className="fw-bold mt-4 mb-3"
                  style={{ color: "#2563eb" }}
                >
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
                    Routine gynecological check-ups & pelvic exams
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Menstrual health & PCOS management
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Pregnancy care (prenatal & postnatal)
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Menopause care & hormonal balance
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Breast health check-up & counselling
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
                    src="https://tse4.mm.bing.net/th/id/OIP.ZieyskCzmcs_TLAwkeXUBQHaE7?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
                    alt="Female Health"
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

        {/* Why Female Health Matters */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{ background: "#fdf2f8", padding: "60px 20px" }}
        >
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-6 mb-4">
                <h2
                  className="h3 fw-bold mb-3"
                  style={{ color: "#2563eb" }}
                >
                  Why Female Health is Important
                </h2>
                <p
                  style={{
                    fontSize: "0.98rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Women&apos;s health is closely linked with hormones,
                  reproductive health, mental well-being, and daily lifestyle.
                  Ignoring small issues like irregular periods, pain, or mood
                  changes can sometimes lead to bigger health problems later.
                </p>
                <p
                  style={{
                    fontSize: "0.98rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Regular check-ups with a Female Health specialist can help
                  detect problems early, improve fertility, support safe
                  pregnancy, and make the journey through menopause smoother and
                  more comfortable.
                </p>
              </div>

              <div className="col-lg-6 mb-4">
                <h4
                  className="fw-bold mb-3"
                  style={{ color: "#2563eb" }}
                >
                  When Should You Visit Our Female Health Department?
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
                    Irregular or very painful periods
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Planning pregnancy or difficulty conceiving
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Unusual discharge, itching, or pelvic pain
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Breast lump, pain, or skin changes
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Hot flashes, mood swings, or sleep issues around menopause
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Care Across Life Stages */}
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
              Care Across Every Stage of a Woman&apos;s Life
            </h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-child",
                  title: "Adolescence & Early Adulthood",
                  text: "Period-related issues, PCOS, anaemia, body changes, and emotional support.",
                },
                {
                  icon: "fas fa-pregnant-woman",
                  title: "Reproductive Years",
                  text: "Fertility planning, safe pregnancy, postpartum care, and family planning.",
                },
                {
                  icon: "fas fa-venus-double",
                  title: "Perimenopause & Menopause",
                  text: "Hot flashes, mood changes, bone health, heart risk, and hormone balance.",
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
                      style={{ color: "#ec4899" }}
                    ></i>
                    <h5
                      className="fw-bold mb-2"
                      style={{ color: "#2563eb" }}
                    >
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

        {/* Common Female Health Conditions */}
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
              Common Female Health Conditions We Manage
            </h2>
            <p
              className="text-center mb-4"
              style={{
                fontSize: "0.95rem",
                color: "#374151",
              }}
            >
              Our specialists help with both everyday concerns and complex
              gynecological conditions.
            </p>
            <div className="row">
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Irregular or painful periods</li>
                  <li className="mb-2">• PCOS (Polycystic Ovary Syndrome)</li>
                  <li className="mb-2">• Anaemia and weakness</li>
                  <li className="mb-2">
                    • White discharge and vaginal infections
                  </li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Pregnancy care & high-risk pregnancy</li>
                  <li className="mb-2">• Miscarriage history support</li>
                  <li className="mb-2">• Infertility evaluation</li>
                  <li className="mb-2">• Breast pain, lumps, or changes</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">
                    • Endometriosis & pelvic pain
                  </li>
                  <li className="mb-2">
                    • Fibroids and heavy bleeding
                  </li>
                  <li className="mb-2">
                    • Menopause symptoms (hot flashes, mood, sleep)
                  </li>
                  <li className="mb-2">
                    • Bone & heart health after menopause
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
            background: "linear-gradient(135deg, #2563eb 0%, #ec4899 100%)",
            color: "#ffffff",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <h2 className="h3 fw-bold mb-3">
              How SwasthaLife Supports Women&apos;s Health
            </h2>
            <p
              className="mb-4"
              style={{
                fontSize: "1rem",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              With smart symptom forms, reminders, and AI-based insights,
              SwasthaLife helps you track your cycle, pregnancy, mood, and
              long-term health — so your doctor gets a clear picture and you get
              timely care.
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                opacity: 0.9,
              }}
            >
              Compassionate care • Private & safe • Science-backed support – all
              in one platform.
            </p>
          </div>
        </motion.section>
      </div>

      <Footer />
    </>
  );
};

export default FemaleHealth;
