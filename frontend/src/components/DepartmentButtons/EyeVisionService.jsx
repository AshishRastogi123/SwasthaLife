import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const EyeVisionService = () => {
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
            background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)",
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
              Eye & Vision Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.1rem", color: "#374151" }}
            >
              Complete vision check-ups, eyewear fitting, and expert eye health
              care.
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
                  About Our Optician Services
                </h2>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Our Eye & Vision Services department focuses on complete
                  vision care — including eyesight testing, eyeglass
                  prescriptions, contact lens fitting, and screening for common
                  eye diseases like glaucoma, cataracts, and dry-eye syndrome.
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Whether you need routine eye checks or specialized care, our
                  opticians and vision experts ensure you get clear vision and
                  healthy eyes for life.
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
                    Complete vision testing & prescription glasses
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Contact lens evaluation & fitting
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Eye strain & dry eye treatment
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Screening for glaucoma, cataract & retina issues
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
                    src="https://th.bing.com/th/id/R.290c9731d3f8f5726e58ad6b5d0cb4bc?rik=Mm%2b5oWHEJbNrnw&riu=http%3a%2f%2fsarvdrishtieyehospital.com%2fassets%2fimages%2fservice%2fsurgical_procedure.webp&ehk=B1FvpBrqNO8fGYI1IxUu29JNPScQUbaZqPmYqxx7klI%3d&risl=&pid=ImgRaw&r=0"
                    alt="Eye Checkup"
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

        {/* Why Eye Care is Important */}
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
                  Why Eye Care Matters
                </h2>
                <p
                  style={{
                    fontSize: "0.98rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  Eyes are one of the most sensitive and important organs of
                  your body. Regular eye check-ups help prevent vision loss,
                  detect diseases early, and reduce problems like headaches,
                  blurry vision, and digital eye strain.
                </p>
                <p
                  style={{
                    fontSize: "0.98rem",
                    color: "#374151",
                    lineHeight: "1.7",
                  }}
                >
                  With modern lifestyle and long screen time, eye care is now
                  more essential than ever — especially for students, office
                  workers, and elders.
                </p>
              </div>

              <div className="col-lg-6 mb-4">
                <h4 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                  When Should You Visit the Optician?
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
                    Blurry or double vision
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Eye strain, headache, or dryness
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Difficulty seeing far or near
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Redness, itching, irritation, or allergies
                  </li>
                  <li className="mb-2">
                    <i
                      className="fas fa-arrow-right me-2"
                      style={{ color: "#10b981" }}
                    ></i>
                    Annual routine eye check-up
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Vision Care for All Ages */}
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
              Vision Care for Every Age Group
            </h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-child",
                  title: "Children",
                  text: "Detecting early vision problems, squint, lazy eye, and school screening.",
                },
                {
                  icon: "fas fa-user",
                  title: "Adults",
                  text: "Screen-time effects, glasses, contact lenses, and dry eye treatment.",
                },
                {
                  icon: "fas fa-user-clock",
                  title: "Seniors",
                  text: "Cataract check-ups, glaucoma screening, diabetic eye disease monitoring.",
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

        {/* Common Eye Conditions */}
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
              Common Eye Conditions We Manage
            </h2>
            <p
              className="text-center mb-4"
              style={{
                fontSize: "0.95rem",
                color: "#374151",
              }}
            >
              Our specialists diagnose and treat a wide range of vision and eye
              health problems.
            </p>
            <div className="row">
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">
                    • Refractive errors (Myopia, Hyperopia)
                  </li>
                  <li className="mb-2">• Astigmatism</li>
                  <li className="mb-2">• Lazy eye (Amblyopia)</li>
                  <li className="mb-2">• Squint (Strabismus)</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Dry eye syndrome</li>
                  <li className="mb-2">• Eye allergies</li>
                  <li className="mb-2">• Red eye / irritation</li>
                  <li className="mb-2">• Computer vision syndrome</li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <ul
                  className="list-unstyled"
                  style={{ fontSize: "0.9rem", color: "#374151" }}
                >
                  <li className="mb-2">• Cataract</li>
                  <li className="mb-2">• Glaucoma</li>
                  <li className="mb-2">• Diabetic eye disease</li>
                  <li className="mb-2">• Retinal issues</li>
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
              How SwasthaLife Supports Eye Health
            </h2>
            <p
              className="mb-4"
              style={{
                fontSize: "1rem",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              With smart symptom analysis, AI-based prediction tools, and easy
              access to experts, SwasthaLife helps you monitor your vision
              health and catch issues early.
            </p>
            <p style={{ fontSize: "0.95rem", opacity: 0.9 }}>
              Clear vision • Early detection • Continuous eye care — all in one
              system.
            </p>
          </div>
        </motion.section>
      </div>

      <Footer />
    </>
  );
};

export default EyeVisionService;
