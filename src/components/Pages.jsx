// import React from "react";
// import { motion } from "framer-motion";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// const Pages = () => {
//   const sectionVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0 },
//   };

//   return (
//     <>
//       <Navbar />
//       <div
//         style={{
//           fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif",
//         }}
//       >
//         {/* Hero Section */}
//         <motion.section
//           initial="hidden"
//           whileInView="visible"
//           variants={sectionVariants}
//           transition={{ duration: 0.6 }}
//           className="hero-section py-5"
//           style={{
//             background: "linear-gradient(135deg, #e0f2fe 0%, #fef9c3 100%)",
//             color: "#1e293b",
//             textAlign: "center",
//             padding: "80px 20px",
//             marginTop: "76px",
//           }}
//         >
//           <div className="container">
//             <motion.h1
//               initial={{ opacity: 0, y: -20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="display-4 fw-bold mb-4"
//               style={{ color: "#2563eb" }}
//             >
//               About Our Health Prediction System
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="lead"
//               style={{ fontSize: "1.2rem", color: "#374151" }}
//             >
//               Our project uses Machine Learning to analyze health data and
//               predict potential diseases early — helping people take preventive
//               action and live healthier lives.
//             </motion.p>
//           </div>
//         </motion.section>

//         {/* Vision and Mission */}
//         <motion.section
//           initial="hidden"
//           whileInView="visible"
//           variants={sectionVariants}
//           transition={{ duration: 0.6 }}
//           className="vision-section py-5"
//           style={{
//             background: "#ffffff",
//             padding: "60px 20px",
//           }}
//         >
//           <div className="container text-center">
//             <motion.h2
//               initial={{ opacity: 0, y: -20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="fw-bold mb-4"
//               style={{ color: "#2563eb" }}
//             >
//               Our Vision & Mission
//             </motion.h2>
//             <p className="text-muted mb-4" style={{ fontSize: "1rem" }}>
//               We aim to use Machine Learning models to bring technology closer
//               to healthcare — making disease prediction accurate, fast, and
//               accessible for everyone.
//             </p>
//             <div className="row mt-5">
//               <div className="col-md-6 mb-4">
//                 <div className="card border-0 shadow-sm p-4 h-100">
//                   <i
//                     className="fas fa-eye fa-3x mb-3"
//                     style={{ color: "#10b981" }}
//                   ></i>
//                   <h5
//                     className="fw-bold mb-3"
//                     style={{ color: "#2563eb" }}
//                   >
//                     Our Vision
//                   </h5>
//                   <p className="text-muted">
//                     To create a smart and reliable ML-based health prediction
//                     system that empowers users to detect early signs of diseases
//                     and take timely preventive steps.
//                   </p>
//                 </div>
//               </div>
//               <div className="col-md-6 mb-4">
//                 <div className="card border-0 shadow-sm p-4 h-100">
//                   <i
//                     className="fas fa-bullseye fa-3x mb-3"
//                     style={{ color: "#10b981" }}
//                   ></i>
//                   <h5
//                     className="fw-bold mb-3"
//                     style={{ color: "#2563eb" }}
//                   >
//                     Our Mission
//                   </h5>
//                   <p className="text-muted">
//                     To simplify healthcare prediction using data-driven Machine
//                     Learning models that improve efficiency, reduce diagnosis
//                     delays, and support early detection.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Key Features Section */}
//         <motion.section
//           initial="hidden"
//           whileInView="visible"
//           variants={sectionVariants}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="features-section py-5"
//           style={{
//             background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
//             padding: "60px 20px",
//           }}
//         >
//           <div className="container text-center">
//             <motion.h2
//               initial={{ opacity: 0, y: -20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="fw-bold mb-5"
//               style={{ color: "#2563eb" }}
//             >
//               Key Features
//             </motion.h2>
//             <div className="row">
//               {[
//                 {
//                   icon: "fas fa-brain",
//                   title: "ML-Based Prediction",
//                   desc: "Utilizes algorithms like Random Forest and Decision Tree for accurate health predictions.",
//                 },
//                 {
//                   icon: "fas fa-database",
//                   title: "Data Preprocessing",
//                   desc: "Cleans and prepares healthcare datasets for better model learning and reliability.",
//                 },
//                 {
//                   icon: "fas fa-chart-line",
//                   title: "Performance Visualization",
//                   desc: "Displays accuracy, loss, and confusion matrix charts to explain how the model performs.",
//                 },
//                 {
//                   icon: "fas fa-lock",
//                   title: "User Privacy",
//                   desc: "Ensures data security by keeping all health records safe and confidential.",
//                 },
//                 {
//                   icon: "fas fa-laptop-medical",
//                   title: "Smart Reports",
//                   desc: "Generates health prediction reports with confidence scores and suggestions.",
//                 },
//                 {
//                   icon: "fas fa-lightbulb",
//                   title: "Continuous Learning",
//                   desc: "Model performance can improve with more data and retraining over time.",
//                 },
//               ].map((feature, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: index * 0.1 }}
//                   className="col-lg-4 col-md-6 mb-4"
//                 >
//                   <div className="card border-0 shadow-sm p-4 h-100 text-center">
//                     <i
//                       className={`${feature.icon} fa-3x mb-3`}
//                       style={{ color: "#10b981" }}
//                     ></i>
//                     <h5
//                       className="fw-bold mb-2"
//                       style={{ color: "#2563eb" }}
//                     >
//                       {feature.title}
//                     </h5>
//                     <p
//                       className="text-muted"
//                       style={{ fontSize: "0.9rem" }}
//                     >
//                       {feature.desc}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </motion.section>

//         {/* Future Enhancements Section */}
//         <motion.section
//           initial="hidden"
//           whileInView="visible"
//           variants={sectionVariants}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className="enhancements-section py-5"
//           style={{
//             background: "#ffffff",
//             padding: "60px 20px",
//           }}
//         >
//           <div className="container text-center">
//             <motion.h2
//               initial={{ opacity: 0, y: -20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="fw-bold mb-4"
//               style={{ color: "#2563eb" }}
//             >
//               Future Enhancements
//             </motion.h2>
//             <p className="text-muted mb-5" style={{ fontSize: "1rem" }}>
//               Our future goal is to integrate this ML-based system with real-time
//               health monitoring and cloud-based analytics.
//             </p>
//             <div className="row">
//               {[
//                 {
//                   icon: "fas fa-cloud-upload-alt",
//                   title: "Cloud Integration",
//                   desc: "Enable users to securely store and access their reports anytime using cloud storage.",
//                 },
//                 {
//                   icon: "fas fa-mobile-alt",
//                   title: "Mobile App Support",
//                   desc: "Develop a mobile-friendly version for real-time predictions on the go.",
//                 },
//                 {
//                   icon: "fas fa-sync-alt",
//                   title: "Model Optimization",
//                   desc: "Apply hyperparameter tuning and auto ML techniques to boost accuracy and efficiency.",
//                 },
//               ].map((enh, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: i * 0.1 }}
//                   className="col-md-4 mb-4"
//                 >
//                   <div className="card border-0 shadow-sm p-4 h-100 text-center">
//                     <i
//                       className={`${enh.icon} fa-3x mb-3`}
//                       style={{ color: "#10b981" }}
//                     ></i>
//                     <h5
//                       className="fw-bold mb-2"
//                       style={{ color: "#2563eb" }}
//                     >
//                       {enh.title}
//                     </h5>
//                     <p className="text-muted">{enh.desc}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </motion.section>

//         {/* Closing Section */}
//         <motion.section
//           initial="hidden"
//           whileInView="visible"
//           variants={sectionVariants}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="closing-section py-5"
//           style={{
//             background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
//             color: "#ffffff",
//             textAlign: "center",
//             padding: "60px 20px",
//           }}
//         >
//           <div className="container">
//             <motion.h2
//               initial={{ opacity: 0, y: -20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="fw-bold mb-3"
//             >
//               Empowering Healthcare with Machine Learning
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="lead mb-0"
//               style={{ fontSize: "1.1rem" }}
//             >
//               Turning health data into actionable insights — because prevention is better than cure.
//             </motion.p>
//           </div>
//         </motion.section>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Pages;