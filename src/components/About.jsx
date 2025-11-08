import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const About = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

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
            About SwasthaLife
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lead"
            style={{ fontSize: "1.2rem", color: "#374151" }}
          >
            Empowering healthcare through innovation, technology, and compassionate care.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mission-section py-5"
        style={{
          background: "#ffffff",
          padding: "60px 20px",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="h1 fw-bold mb-4"
                style={{ color: "#2563eb" }}
              >
                Our Mission
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: "1.1rem", color: "#374151", lineHeight: "1.6" }}
              >
                At SwasthaLife, our mission is to revolutionize healthcare by leveraging cutting-edge AI technology
                to predict and prevent diseases before they become critical. We believe in making healthcare
                accessible, affordable, and proactive for everyone, regardless of their location or background.
              </motion.p>
              <motion.ul
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="list-unstyled"
                style={{ fontSize: "1rem", color: "#374151" }}
              >
                <li className="mb-3">
                  <i className="fas fa-check-circle me-3" style={{ color: "#10b981" }}></i>
                  AI-powered disease prediction and prevention
                </li>
                <li className="mb-3">
                  <i className="fas fa-check-circle me-3" style={{ color: "#10b981" }}></i>
                  24/7 accessible healthcare solutions
                </li>
                <li className="mb-3">
                  <i className="fas fa-check-circle me-3" style={{ color: "#10b981" }}></i>
                  Personalized health recommendations
                </li>
                <li className="mb-3">
                  <i className="fas fa-check-circle me-3" style={{ color: "#10b981" }}></i>
                  Community-driven healthcare approach
                </li>
              </motion.ul>
            </div>
            <div className="col-lg-6">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src="https://tse2.mm.bing.net/th/id/OIP.rE6sHUx7lLRfwLEnOOPi7gHaEd?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="SwasthaLife Mission"
                className="img-fluid rounded shadow"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="values-section py-5"
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
            Our Core Values
          </motion.h2>
          <div className="row">
            {[
              {
                icon: "fas fa-heart",
                title: "Compassion",
                description: "We care deeply about every individual and their health journey."
              },
              {
                icon: "fas fa-brain",
                title: "Innovation",
                description: "We embrace cutting-edge technology to improve healthcare outcomes."
              },
              {
                icon: "fas fa-users",
                title: "Community",
                description: "We believe in the power of community for better health and wellness."
              },
              {
                icon: "fas fa-shield-alt",
                title: "Trust",
                description: "We build trust through transparency, reliability, and ethical practices."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="col-lg-3 col-md-6 mb-4"
              >
                <div
                  className="card h-100 border-0 shadow-sm"
                  style={{
                    background: "#ffffff",
                    borderRadius: "15px",
                    padding: "30px 20px",
                    textAlign: "center"
                  }}
                >
                  <motion.i
                    whileHover={{ scale: 1.1 }}
                    className={`${value.icon} fa-3x mb-3`}
                    style={{ color: "#10b981" }}
                  ></motion.i>
                  <h5 className="card-title fw-bold" style={{ color: "#2563eb" }}>
                    {value.title}
                  </h5>
                  <p className="card-text" style={{ color: "#374151" }}>
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="story-section py-5"
        style={{
          background: "#ffffff",
          padding: "60px 20px",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="h1 fw-bold mb-4"
                style={{ color: "#2563eb" }}
              >
                Our Story
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: "1.1rem", color: "#374151", lineHeight: "1.6" }}
              >
                Founded in 2023, SwasthaLife emerged from a simple yet powerful idea: what if we could
                predict health issues before they become problems? Our team of healthcare professionals,
                data scientists, and technology experts came together to create a platform that uses
                artificial intelligence to analyze health data and provide personalized insights.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ fontSize: "1.1rem", color: "#374151", lineHeight: "1.6" }}
              >
                Today, we're proud to serve thousands of users, helping them take control of their
                health and live longer, healthier lives. Our commitment to innovation and compassion
                drives everything we do.
              </motion.p>
            </div>
            <div className="col-lg-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Healthcare Technology"
                  className="img-fluid rounded shadow"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default About;
