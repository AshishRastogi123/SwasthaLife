import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <section
      className="footer pt-5"
      style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
        fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif",
        color: "#ffffff",
        margin: "40px 0",
      }}
    >
      <footer className="text-center text-lg-start">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom"
          style={{ borderColor: "#4b5563 !important" }}
        >
          <div className="me-5 d-none d-lg-block">
            <span style={{ fontWeight: "600", color: "#e5e7eb" }}>Get connected with OUR Team on social networks:</span>
          </div>
          <div className="d-flex">
            <motion.a
              href="#"
              className="me-4"
              whileHover={{ scale: 1.2 }}
              style={{ color: "#ffffff", textDecoration: "none" }}
            >
              <i className="fab fa-facebook-f fa-lg"></i>
            </motion.a>
            <motion.a
              href="#"
              className="me-4"
              whileHover={{ scale: 1.2 }}
              style={{ color: "#ffffff", textDecoration: "none" }}
            >
              <i className="fab fa-youtube fa-lg"></i>
            </motion.a>
            <motion.a
              href="#"
              className="me-4"
              whileHover={{ scale: 1.2 }}
              style={{ color: "#ffffff", textDecoration: "none" }}
            >
              <i className="fab fa-google fa-lg"></i>
            </motion.a>
            <motion.a
              href="#"
              className="me-4"
              whileHover={{ scale: 1.2 }}
              style={{ color: "#ffffff", textDecoration: "none" }}
            >
              <i className="fab fa-instagram fa-lg"></i>
            </motion.a>
            <motion.a
              href="#"
              className="me-4"
              whileHover={{ scale: 1.2 }}
              style={{ color: "#ffffff", textDecoration: "none" }}
            >
              <i className="fab fa-linkedin-in fa-lg"></i>
            </motion.a>
            <motion.a
              href="#"
              className="me-4"
              whileHover={{ scale: 1.2 }}
              style={{ color: "#ffffff", textDecoration: "none" }}
            >
              <i className="fab fa-github fa-lg"></i>
            </motion.a>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="container text-center text-md-start mt-5">
            <div className="row mt-3">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6
                  className="text-uppercase fw-bold mb-4"
                  style={{ color: "#ffffff", fontSize: "1.1rem" }}
                >
                  SwasthaLife India
                </h6>
                <div className="post1 col-lg-12 col-md-12 col-12 pb-4">
                  <img
                    className="img-fluid pb-3"
                    src="https://tse2.mm.bing.net/th/id/OIP.rE6sHUx7lLRfwLEnOOPi7gHaEd?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                    alt="SwasthaLife Logo"
                    style={{ borderRadius: "10px", width: "100px" }}
                  />
                </div>
                <p style={{ color: "#e5e7eb", lineHeight: "1.6", fontSize: "0.95rem" }}>
                  Empowering lives through innovation, our dedicated team built
                  a responsive website that predicts diseases—bringing
                  healthcare one step closer, faster, and smarter.
                </p>
              </div>

              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6
                  className="text-uppercase fw-bold mb-4"
                  style={{ color: "#ffffff", fontSize: "1.1rem" }}
                >
                  Departments
                </h6>
                <p>
                  <a href="#" style={{ color: "#e5e7eb", textDecoration: "none", fontWeight: "500" }}>
                    Family Medicine
                  </a>
                </p>
                <p>
                  <a href="#" style={{ color: "#e5e7eb", textDecoration: "none", fontWeight: "500" }}>
                    Female Health
                  </a>
                </p>
                <p>
                  <a href="#" style={{ color: "#e5e7eb", textDecoration: "none", fontWeight: "500" }}>
                    Optician
                  </a>
                </p>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6
                  className="text-uppercase fw-bold mb-4"
                  style={{ color: "#ffffff", fontSize: "1.1rem" }}
                >
                  Useful Links
                </h6>
                <p>
                  <a href="#" style={{ color: "#e5e7eb", textDecoration: "none", fontWeight: "500" }}>
                    Our Health Experts
                  </a>
                </p>
                <p>
                  <a href="#" style={{ color: "#e5e7eb", textDecoration: "none", fontWeight: "500" }}>
                    Appointments
                  </a>
                </p>
                <p>
                  <a href="#" style={{ color: "#e5e7eb", textDecoration: "none", fontWeight: "500" }}>
                    Our Helpers
                  </a>
                </p>
                <p>
                  <a href="#" style={{ color: "#e5e7eb", textDecoration: "none", fontWeight: "500" }}>
                    Our Medicine
                  </a>
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6
                  className="text-uppercase fw-bold mb-4"
                  style={{ color: "#ffffff", fontSize: "1.1rem" }}
                >
                  Contact Us
                </h6>
                <p style={{ color: "#e5e7eb", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  <strong style={{ color: "#ffffff" }}>Address:</strong> Invertis Village, Delhi Lucknow
                  Highway NH-24, Bareilly, Uttar Pradesh - 243123, India
                </p>
                <p style={{ color: "#e5e7eb", fontSize: "0.9rem" }}>
                  <strong style={{ color: "#ffffff" }}>Email:</strong> info@techteam.org
                </p>
                <p style={{ color: "#e5e7eb", fontSize: "0.9rem" }}>
                  <strong style={{ color: "#ffffff" }}>Phone:</strong>
                  <br />
                  +91 84456 31880 , +91 97560 21146
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center p-4"
          style={{
            backgroundColor: "rgba(30, 58, 138, 0.8)",
            color: "#e5e7eb",
            borderTop: "1px solid #4b5563",
          }}
        >
          © 2025 techteamrights:{" "}
          <a
            className="fw-bold"
            href="#"
            style={{ color: "#2563eb", textDecoration: "none" }}
          >
            techteamindia.in
          </a>
        </motion.div>
      </footer>
    </section>
  );
};

export default Footer;
