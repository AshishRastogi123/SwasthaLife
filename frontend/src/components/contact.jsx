import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Contact = () => {
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
              className="display-4 fw-bold mb-4"
              style={{ color: "#2563eb" }}
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.2rem", color: "#374151" }}
            >
              We’d love to hear from you! Reach out to our team for support,
              collaboration, or feedback.
            </motion.p>
          </div>
        </motion.section>

        {/* Contact Info Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
          className="contact-info py-5"
          style={{
            background: "#ffffff",
            padding: "60px 20px",
          }}
        >
          <div className="container text-center">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="fw-bold mb-5"
              style={{ color: "#2563eb" }}
            >
              Get In Touch
            </motion.h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-phone-alt",
                  title: "Phone",
                  desc: "+91 84456 31880",
                },
                {
                  icon: "fas fa-envelope",
                  title: "Email",
                  desc: "support@swasthalife.com",
                },
                {
                  icon: "fas fa-map-marker-alt",
                  title: "Address",
                  desc: "Invertis University, Bareilly, Uttar Pradesh",
                },
              ].map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="col-md-4 mb-4"
                >
                  <div className="card border-0 shadow-sm p-4 h-100">
                    <i
                      className={`${info.icon} fa-3x mb-3`}
                      style={{ color: "#10b981" }}
                    ></i>
                    <h5 className="fw-bold mb-2" style={{ color: "#2563eb" }}>
                      {info.title}
                    </h5>
                    <p className="text-muted">{info.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="contact-form-section py-5"
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 mb-4">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="fw-bold mb-4"
                  style={{ color: "#2563eb" }}
                >
                  Send Us a Message
                </motion.h2>
                <p className="text-muted mb-4" style={{ fontSize: "1rem" }}>
                  Have questions or suggestions? Fill out the form, and our team
                  will get back to you as soon as possible.
                </p>
                <form>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Your Message"
                      required
                    ></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary px-4 py-2"
                    style={{
                      backgroundColor: "#2563eb",
                      borderRadius: "25px",
                      border: "none",
                    }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
              <div className="col-md-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="map-container shadow-sm"
                >
                  <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.703167516672!2d79.41917987549604!3d28.367110495312708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a006d47e71f17d%3A0xf4b7f66a4dc6b7df!2sInvertis%20University!5e0!3m2!1sen!2sin!4v1700150000000!5m2!1sen!2sin"
                    width="100%"
                    height="350"
                    style={{
                      border: "0",
                      borderRadius: "15px",
                    }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </motion.div>
              </div>
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
              className="fw-bold mb-4"
            >
              We’re Here to Help
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lead mb-4"
              style={{ fontSize: "1.1rem" }}
            >
              Whether you have questions or need assistance, feel free to reach
              out. Your feedback matters to us!
            </motion.p>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;