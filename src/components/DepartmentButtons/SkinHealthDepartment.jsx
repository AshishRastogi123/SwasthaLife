import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const SkinHealthDepartment = () => {
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
            background: "linear-gradient(135deg, #dbeafe 0%, #ffe4e6 100%)",
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
              Skin Health & Dermatology
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.1rem", color: "#374151" }}
            >
              Complete skin care, allergy treatment, and advanced dermatology services for healthier skin.
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
                  About Our Skin Health Department
                </h2>
                <p
                  style={{ fontSize: "1rem", color: "#374151", lineHeight: "1.7" }}
                >
                  Our Dermatology Department provides complete skin health care including acne treatment, 
                  pigmentation control, hair and scalp issues, eczema, allergies, fungal infections, and cosmetic solutions.
                </p>
                <p
                  style={{ fontSize: "1rem", color: "#374151", lineHeight: "1.7" }}
                >
                  With modern equipment and expert dermatologists, we diagnose skin issues accurately and provide the best treatment 
                  suitable for every skin type — from children to adults.
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
                    Acne, scars & pigmentation treatment
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle me-2" style={{ color: "#10b981" }}></i>
                    Hair fall & dandruff treatment
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle me-2" style={{ color: "#10b981" }}></i>
                    Eczema, dermatitis & allergy management
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check-circle me-2" style={{ color: "#10b981" }}></i>
                    Skin infection and fungal treatment
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
                    src="https://femina.wwmindia.com/content/2020/jul/thkiara1594905821.jpg"
                    alt="Skin Checkup"
                    className="img-fluid rounded shadow"
                    style={{ maxWidth: "100%", height: "auto", objectFit: "cover" }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Why Skin Health Matters */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{ background: "#fef2f2", padding: "60px 20px" }}
        >
          <div className="container">
            <div className="row align-items-start">
              <div className="col-lg-6 mb-4">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#2563eb" }}>
                  Why Skin Care is Important
                </h2>
                <p style={{ fontSize: "0.98rem", color: "#374151", lineHeight: "1.7" }}>
                  Skin is the body’s largest organ and protects you from dust, pollution, infections,
                  and harmful UV rays. Poor skin health can affect confidence, comfort, and overall well-being.
                </p>
                <p style={{ fontSize: "0.98rem", color: "#374151", lineHeight: "1.7" }}>
                  Regular dermatology check-ups help prevent acne scars, detect skin diseases early,
                  and treat allergies or infections before they worsen.
                </p>
              </div>

              <div className="col-lg-6 mb-4">
                <h4 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                  When Should You Visit the Dermatologist?
                </h4>
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.95rem", color: "#374151" }}
                >
                  <li className="mb-2"><i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Pimples that leave dark marks or scars
                  </li>
                  <li className="mb-2"><i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Hair fall, scalp infection, or dandruff
                  </li>
                  <li className="mb-2"><i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Dry, itchy, or red skin patches
                  </li>
                  <li className="mb-2"><i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Skin allergy, fungal patches, or rashes
                  </li>
                  <li className="mb-2"><i className="fas fa-arrow-right me-2" style={{ color: "#10b981" }}></i>
                    Unusual moles, skin bumps, or skin thinning
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Care for All Ages */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #eef2ff 0%, #ffe4e6 100%)",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <h2 className="text-center h3 fw-bold mb-5" style={{ color: "#2563eb" }}>
              Skin Care for Every Age Group
            </h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-child",
                  title: "Children",
                  text: "Eczema, rashes, infections, dryness, and birthmark evaluations.",
                },
                {
                  icon: "fas fa-user",
                  title: "Adults",
                  text: "Acne, pigmentation, dark circles, hair fall, and lifestyle-related skin issues.",
                },
                {
                  icon: "fas fa-user-clock",
                  title: "Seniors",
                  text: "Age-related skin thinning, dryness, wrinkles, and chronic skin conditions.",
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
                    <i className={`${item.icon} fa-3x mb-3`} style={{ color: "#2563eb" }}></i>
                    <h5 className="fw-bold mb-2" style={{ color: "#2563eb" }}>
                      {item.title}
                    </h5>
                    <p style={{ fontSize: "0.95rem", color: "#374151" }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Common Skin Conditions */}
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
              Common Skin Conditions We Manage
            </h2>
            <p
              className="text-center mb-4"
              style={{ fontSize: "0.95rem", color: "#374151" }}
            >
              From simple acne to chronic skin diseases — we diagnose and treat all skin concerns.
            </p>

            <div className="row">
              <div className="col-md-4 mb-3">
                <ul className="list-unstyled" style={{ fontSize: "0.9rem", color: "#374151" }}>
                  <li className="mb-2">• Acne & scars</li>
                  <li className="mb-2">• Pigmentation & dark spots</li>
                  <li className="mb-2">• Sunburn & tanning</li>
                  <li className="mb-2">• Melasma</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul className="list-unstyled" style={{ fontSize: "0.9rem", color: "#374151" }}>
                  <li className="mb-2">• Eczema & dermatitis</li>
                  <li className="mb-2">• Psoriasis</li>
                  <li className="mb-2">• Fungal infections</li>
                  <li className="mb-2">• Skin allergies</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul className="list-unstyled" style={{ fontSize: "0.9rem", color: "#374151" }}>
                  <li className="mb-2">• Hair fall & dandruff</li>
                  <li className="mb-2">• Skin tags, moles, warts</li>
                  <li className="mb-2">• Anti-ageing & wrinkle treatment</li>
                  <li className="mb-2">• Dark circles</li>
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
            <h2 className="h3 fw-bold mb-3">How SwasthaLife Supports Skin Health</h2>
            <p
              className="mb-4"
              style={{ fontSize: "1rem", maxWidth: "700px", margin: "0 auto" }}
            >
              AI-based skin analysis, symptom tracking, personalized skincare suggestions,
              and early detection tools make skin care easier and more accurate.
            </p>
            <p style={{ fontSize: "0.95rem", opacity: 0.9 }}>
              Better diagnosis • Faster treatment • Healthy glowing skin — all in one platform.
            </p>
          </div>
        </motion.section>
      </div>

      <Footer />
    </>
  );
};

export default SkinHealthDepartment;
