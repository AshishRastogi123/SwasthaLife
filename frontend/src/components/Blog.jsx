import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Blog = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const blogPosts = [
    {
      title: "The Role of AI in Modern Healthcare",
      date: "November 5, 2025",
      author: "SwasthaLife Team",
      image: "https://cdn-icons-png.flaticon.com/512/3771/3771417.png",
      description:
        "Artificial Intelligence is revolutionizing the healthcare industry by enabling faster diagnosis, predictive analytics, and improved patient care. Learn how deep learning is transforming medical systems globally.",
    },
    {
      title: "Deep Learning for Disease Prediction",
      date: "October 28, 2025",
      author: "Aditya Tiwari",
      image:
        "https://cdn0.iconfinder.com/data/icons/data-science-5/140/deep_learning_structure_learn_algorithm_prediction_scheme-512.png",
      description:
        "Deep learning models, such as CNNs and RNNs, are being widely used to predict various diseases. This article explains how these models work and how they can support doctors in making data-driven decisions.",
    },
    {
      title:
        "Automation and data analytics improve accuracy, efficiency, and patient outcomes worldwide.",
      date: "October 15, 2025",
      author: "Manju",
      image:
        "https://tse3.mm.bing.net/th/id/OIP.0MQMQAcYySs5mqv0kqSqYAHaD4?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3",
      description:
        "Automation and data analytics are revolutionizing healthcare by reducing human errors, streamlining clinical workflows, and enabling data-driven decisions. By analyzing vast amounts of patient data, healthcare systems can identify patterns, predict health risks, and deliver more accurate and timely treatments — ultimately improving efficiency and patient outcomes globally.",
    },
    {
      title:
        "AI is transforming healthcare by enabling faster diagnosis and personalized treatment plans.",
      date: "November 11, 2025",
      author: "Ashish Kumar Rastogi",
      image:
        "https://blogs.dpuerp.in/images/blog/15/10974-ai-revolutionizing-healthcare.jpg",
      description:
        "Artificial Intelligence is revolutionizing the healthcare industry by analyzing vast amounts of medical data quickly and accurately. Through AI-driven algorithms, doctors can detect diseases at an early stage, recommend personalized treatment plans, and reduce human error in diagnosis. This not only saves time but also improves patient care and treatment outcomes.",
    },
    {
      title:
        "Machine learning models help predict diseases before symptoms even appear.",
      date: "October 21, 2025",
      author: "Hardik Agarwal",
      image:
        "https://tse4.mm.bing.net/th/id/OIP.QT12WYUhHZf1Hi1ayj5wIAHaE-?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3",
      description:
        "Machine learning models analyze large amounts of medical data — such as patient history, lab results, and imaging — to identify early patterns of illness. By recognizing these hidden signs, AI can predict potential diseases before visible symptoms appear, enabling early diagnosis and timely treatment.",
    },
    {
      title: "The Future of Smart Healthcare Systems",
      date: "October 15, 2025",
      author: "Ansh Saxena",
      image: "https://cdn-icons-png.flaticon.com/512/2950/2950660.png",
      description:
        "From wearable health monitors to AI-powered diagnostics, smart healthcare systems are reshaping patient experiences and bringing real-time analytics into daily medical practice.",
    },
  ];

  return (
    <>
      <Navbar />
      <div
        style={{
          fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif",
        }}
      >
        {/* HERO – About Our Health Prediction System */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
          className="hero-section py-5"
          style={{
            background: "linear-gradient(135deg, #e0f2fe 0%, #fef9c3 100%)",
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
              About Our Health Prediction System
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.2rem", color: "#374151" }}
            >
              Our project uses Machine Learning to analyze health data and
              predict potential diseases early — helping people take preventive
              action and live healthier lives.
            </motion.p>
          </div>
        </motion.section>

        {/* Vision & Mission */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
          className="vision-section py-5"
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
              className="fw-bold mb-4"
              style={{ color: "#2563eb" }}
            >
              Our Vision & Mission
            </motion.h2>
            <p className="text-muted mb-4" style={{ fontSize: "1rem" }}>
              We aim to use Machine Learning models to bring technology closer
              to healthcare — making disease prediction accurate, fast, and
              accessible for everyone.
            </p>
            <div className="row mt-5">
              <div className="col-md-6 mb-4">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <i
                    className="fas fa-eye fa-3x mb-3"
                    style={{ color: "#10b981" }}
                  ></i>
                  <h5 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                    Our Vision
                  </h5>
                  <p className="text-muted">
                    To create a smart and reliable ML-based health prediction
                    system that empowers users to detect early signs of diseases
                    and take timely preventive steps.
                  </p>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <i
                    className="fas fa-bullseye fa-3x mb-3"
                    style={{ color: "#10b981" }}
                  ></i>
                  <h5 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                    Our Mission
                  </h5>
                  <p className="text-muted">
                    To simplify healthcare prediction using data-driven Machine
                    Learning models that improve efficiency, reduce diagnosis
                    delays, and support early detection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="features-section py-5"
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
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
              Key Features
            </motion.h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-brain",
                  title: "ML-Based Prediction",
                  desc: "Utilizes algorithms like Random Forest and Decision Tree for accurate health predictions.",
                },
                {
                  icon: "fas fa-database",
                  title: "Data Preprocessing",
                  desc: "Cleans and prepares healthcare datasets for better model learning and reliability.",
                },
                {
                  icon: "fas fa-chart-line",
                  title: "Performance Visualization",
                  desc: "Displays accuracy, loss, and confusion matrix charts to explain how the model performs.",
                },
                {
                  icon: "fas fa-lock",
                  title: "User Privacy",
                  desc: "Ensures data security by keeping all health records safe and confidential.",
                },
                {
                  icon: "fas fa-laptop-medical",
                  title: "Smart Reports",
                  desc: "Generates health prediction reports with confidence scores and suggestions.",
                },
                {
                  icon: "fas fa-lightbulb",
                  title: "Continuous Learning",
                  desc: "Model performance can improve with more data and retraining over time.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="col-lg-4 col-md-6 mb-4"
                >
                  <div className="card border-0 shadow-sm p-4 h-100 text-center">
                    <i
                      className={`${feature.icon} fa-3x mb-3`}
                      style={{ color: "#10b981" }}
                    ></i>
                    <h5 className="fw-bold mb-2" style={{ color: "#2563eb" }}>
                      {feature.title}
                    </h5>
                    <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Future Enhancements */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="enhancements-section py-5"
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
              className="fw-bold mb-4"
              style={{ color: "#2563eb" }}
            >
              Future Enhancements
            </motion.h2>
            <p className="text-muted mb-5" style={{ fontSize: "1rem" }}>
              Our future goal is to integrate this ML-based system with
              real-time health monitoring and cloud-based analytics.
            </p>
            <div className="row">
              {[
                {
                  icon: "fas fa-cloud-upload-alt",
                  title: "Cloud Integration",
                  desc: "Enable users to securely store and access their reports anytime using cloud storage.",
                },
                {
                  icon: "fas fa-mobile-alt",
                  title: "Mobile App Support",
                  desc: "Develop a mobile-friendly version for real-time predictions on the go.",
                },
                {
                  icon: "fas fa-sync-alt",
                  title: "Model Optimization",
                  desc: "Apply hyperparameter tuning and auto ML techniques to boost accuracy and efficiency.",
                },
              ].map((enh, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="col-md-4 mb-4"
                >
                  <div className="card border-0 shadow-sm p-4 h-100 text-center">
                    <i
                      className={`${enh.icon} fa-3x mb-3`}
                      style={{ color: "#10b981" }}
                    ></i>
                    <h5 className="fw-bold mb-2" style={{ color: "#2563eb" }}>
                      {enh.title}
                    </h5>
                    <p className="text-muted">{enh.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Closing Line (System Theme) */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="closing-section py-5"
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
              className="fw-bold mb-3"
            >
              Empowering Healthcare with Machine Learning
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lead mb-0"
              style={{ fontSize: "1.1rem" }}
            >
              Turning health data into actionable insights — because prevention
              is better than cure.
            </motion.p>
          </div>
        </motion.section>

        {/* BLOG CARDS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
          className="blogs-section py-5"
          style={{
            background: "#ffffff",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <div className="text-center mb-5">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="fw-bold mb-2"
                style={{ color: "#2563eb" }}
              >
                Health & AI Blog
              </motion.h2>
              <p className="text-muted" style={{ fontSize: "1rem" }}>
                Explore the latest insights, innovations, and research in
                AI-driven healthcare and deep learning.
              </p>
            </div>
            <div className="row">
              {blogPosts.map((post, index) => (
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
                      borderRadius: "15px",
                      overflow: "hidden",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="card-img-top"
                      style={{
                        height: "200px",
                        objectFit: "contain",
                        padding: "20px",
                      }}
                    />
                    <div className="card-body">
                      <h5
                        className="card-title fw-bold"
                        style={{ color: "#2563eb" }}
                      >
                        {post.title}
                      </h5>
                      <p className="text-muted small mb-2">
                        <i className="fas fa-calendar-alt me-2"></i>
                        {post.date} | <i className="fas fa-user me-2"></i>
                        {post.author}
                      </p>
                      <p
                        className="card-text"
                        style={{ color: "#374151", fontSize: "0.95rem" }}
                      >
                        {post.description}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary mt-2"
                        style={{
                          borderRadius: "25px",
                          background: "#2563eb",
                          border: "none",
                          fontWeight: "bold",
                          padding: "8px 20px",
                        }}
                      >
                        Read More
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Inspiration / Quote */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="quote-section py-5"
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
              “AI is not replacing doctors — it’s empowering them to make
              smarter, faster, and more accurate decisions.”
            </motion.h2>
            <p className="lead mb-0">— SwasthaLife Team</p>
          </div>
        </motion.section>

        {/* Newsletter */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="newsletter-section py-5"
          style={{
            background: "#f8fafc",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="fw-bold mb-3"
              style={{ color: "#2563eb" }}
            >
              Subscribe to Our Health & AI Newsletter
            </motion.h2>
            <p className="text-muted mb-4">
              Stay updated with the latest articles, innovations, and healthcare
              AI trends from SwasthaLife.
            </p>
            <form className="d-flex justify-content-center">
              <input
                type="email"
                className="form-control me-2"
                placeholder="Enter your email"
                style={{ maxWidth: "300px", borderRadius: "25px" }}
              />
              <button
                type="submit"
                className="btn"
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: "25px",
                  padding: "8px 20px",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
