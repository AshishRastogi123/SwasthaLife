import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Department = () => {
  const navigate = useNavigate();
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const departments = [
    {
      name: "Family Medicine",
      icon: "fas fa-user-md",
      description:
        "Healthcare services for all family members, including regular check-ups and support for long-term health problems.",
      services: [
        "Yearly health check-ups",
        "Vaccinations",
        "Care for long-term illnesses",
        "Health screening tests",
      ],
    },
    {
      name: "Female Health",
      icon: "fas fa-female",
      description:
        "Medical care focused on women's health needs at every stage of life.",
      services: [
        "Women’s health check-ups",
        "Care during pregnancy",
        "Support for menopause",
        "Breast health check-ups",
      ],
    },
    {
      name: "Eye & Vision Services",
      icon: "fas fa-eye",
      description:
        "Eye care services including vision tests, glasses/contact lens fitting, and eye health check-ups.",
      services: [
        "Vision testing",
        "Glasses prescription",
        "Contact lens fitting",
        "Eye disease check-ups",
      ],
    },
    {
      name: "Heart Science",
      icon: "fas fa-heartbeat",
      description:
        "Heart-related care with modern tests and treatments for heart health.",
      services: [
        "Heart ECG test",
        "Stress testing",
        "Heart disease prevention",
        "Heart recovery programs",
      ],
    },
    {
      name: "Skin Health Department",
      icon: "fas fa-allergies",
      description:
        "Skin care services for skin problems and cosmetic treatments.",
      services: [
        "Acne treatment",
        "Skin cancer check-up",
        "Cosmetic skin treatments",
        "Allergy check-ups",
      ],
    },
    {
      name: "Child Health Services",
      icon: "fas fa-child",
      description: "Medical care for babies, children, and teenagers.",
      services: [
        "Routine child check-ups",
        "Child vaccinations",
        "Growth and development checks",
        "Treatment for sick children",
      ],
    },
  ];

  // ✅ Clean diseaseCategories
  const diseaseCategories = [
    {
      category: "Heart (Cardiology)",
      diseases: [
        {
          name: "Heart Attack",
          symptoms: ["Chest pain", "Vomiting feeling", "Heavy sweating"],
          treatments: [
            "Emergency help",
            "Aspirin",
            "Heart balloon treatment (angioplasty)",
          ],
        },
        {
          name: "Irregular Heartbeat",
          symptoms: ["Uneven heartbeat", "Weakness", "Fainting"],
          treatments: ["Pacemaker", "Heart medicines"],
        },
        {
          name: "High Blood Pressure",
          symptoms: ["Headache", "Blurry vision", "Chest heaviness"],
          treatments: ["Low-salt food", "Medicines", "Regular exercise"],
        },
      ],
    },
    {
      category: "Brain (Neurology)",
      diseases: [
        {
          name: "Brain Tumor",
          symptoms: ["Headache", "Vision issues", "Fits / Seizures"],
          treatments: ["Operation", "Radiation", "Chemotherapy"],
        },
        {
          name: "Stroke",
          symptoms: ["Body weakness", "Speech trouble", "Confusion"],
          treatments: ["Clot removal", "Physiotherapy"],
        },
        {
          name: "Epilepsy",
          symptoms: ["Seizures", "Blackout", "Confusion"],
          treatments: ["Anti-seizure tablets", "Surgery"],
        },
      ],
    },
    {
      category: "Cancer (Oncology)",
      diseases: [
        {
          name: "Lung Cancer",
          symptoms: ["Cough", "Chest pain", "Tiredness"],
          treatments: ["Chemotherapy", "Surgery", "Radiation"],
        },
        {
          name: "Breast Cancer",
          symptoms: ["Breast lump", "Skin redness", "Pain"],
          treatments: ["Surgery", "Hormone treatment", "Chemotherapy"],
        },
        {
          name: "Colon Cancer",
          symptoms: ["Stomach pain", "Blood in stool", "Weakness"],
          treatments: ["Surgery", "Radiation", "Medicines"],
        },
      ],
    },
    {
      category: "Lungs (Pulmonology)",
      diseases: [
        {
          name: "Asthma",
          symptoms: ["Whistling breath", "Breathlessness", "Cough"],
          treatments: ["Inhaler", "Steroids", "Avoid dust/allergens"],
        },
        {
          name: "Pneumonia",
          symptoms: ["Fever", "Chest pain", "Cough with mucus"],
          treatments: ["Antibiotics", "Rest", "Drink fluids"],
        },
        {
          name: "TB (Tuberculosis)",
          symptoms: ["Cough", "Weight loss", "Night fever"],
          treatments: ["TB medicines", "Regular doctor visits"],
        },
      ],
    },
    {
      category: "Stomach (Gastroenterology)",
      diseases: [
        {
          name: "Ulcer",
          symptoms: ["Stomach pain", "Vomiting feeling", "Burning in chest"],
          treatments: ["Antacids", "Antibiotics"],
        },
        {
          name: "Hepatitis",
          symptoms: ["Yellow skin", "Tiredness", "Stomach pain"],
          treatments: ["Medicines", "Healthy diet"],
        },
        {
          name: "Gallstones",
          symptoms: ["Stomach pain", "Vomiting", "Gas / indigestion"],
          treatments: ["Surgery", "Pain relief"],
        },
      ],
    },
    {
      category: "Kidney (Nephrology)",
      diseases: [
        {
          name: "Kidney Stones",
          symptoms: ["Severe side pain", "Blood in urine", "Vomiting feeling"],
          treatments: [
            "Stone breaking (Lithotripsy)",
            "Drinking water",
            "Surgery",
          ],
        },
        {
          name: "Kidney Damage",
          symptoms: ["Body swelling", "Tiredness", "Urine changes"],
          treatments: ["Dialysis", "Kidney transplant"],
        },
        {
          name: "UTI",
          symptoms: ["Burning in urine", "Fever", "Lower stomach pain"],
          treatments: ["Antibiotics", "Drink water"],
        },
      ],
    },
    {
      category: "Skin (Dermatology)",
      diseases: [
        {
          name: "Acne",
          symptoms: ["Pimples", "Oily skin", "Spots"],
          treatments: ["Skin creams", "Antibiotics"],
        },
        {
          name: "Eczema",
          symptoms: ["Dry skin", "Itching", "Red skin"],
          treatments: ["Moisturizer", "Steroid creams"],
        },
        {
          name: "Psoriasis",
          symptoms: ["Thick skin patches", "White flakes", "Red skin"],
          treatments: ["Light therapy", "Skin ointments"],
        },
      ],
    },
    {
      category: "Bones & Joints (Orthopedics)",
      diseases: [
        {
          name: "Arthritis",
          symptoms: ["Joint pain", "Swelling", "Stiff joints"],
          treatments: ["Pain tablets", "Exercise", "Surgery"],
        },
        {
          name: "Osteoporosis",
          symptoms: ["Weak bones", "Easy fractures"],
          treatments: ["Calcium", "Vitamin D"],
        },
        {
          name: "Bone Fracture",
          symptoms: ["Severe pain", "Swelling", "Bone shape change"],
          treatments: ["Plaster", "Surgery"],
        },
      ],
    },
    {
      category: "Hormonal (Endocrinology)",
      diseases: [
        {
          name: "Diabetes",
          symptoms: ["Frequent urination", "Tiredness", "Weight loss"],
          treatments: ["Insulin", "Healthy diet"],
        },
        {
          name: "Thyroid Problem",
          symptoms: ["Tiredness", "Weight change"],
          treatments: ["Hormone tablets"],
        },
        {
          name: "Adrenal Problem",
          symptoms: ["Tiredness", "Muscle weakness"],
          treatments: ["Medicines", "Hormone treatment"],
        },
      ],
    },
    {
      category: "Women's Health (Gynecology)",
      diseases: [
        {
          name: "PCOS",
          symptoms: ["Irregular periods", "Acne", "Weight gain"],
          treatments: ["Lifestyle change", "Medicines"],
        },
        {
          name: "Endometriosis",
          symptoms: ["Pelvic pain", "Heavy periods"],
          treatments: ["Pain relief", "Surgery"],
        },
        {
          name: "Period Problems",
          symptoms: ["Irregular cycle", "Pain"],
          treatments: ["Hormone tablets"],
        },
      ],
    },
    {
      category: "Children (Pediatrics)",
      diseases: [
        {
          name: "Measles",
          symptoms: ["Fever", "Skin rash", "Cough"],
          treatments: ["Rest", "Water", "Medicines"],
        },
        {
          name: "Chickenpox",
          symptoms: ["Itchy rash", "Fever", "Tiredness"],
          treatments: ["Anti-itch medicines", "Rest"],
        },
        {
          name: "Mumps",
          symptoms: ["Face swelling", "Cheek pain", "Fever"],
          treatments: ["Pain relief", "Drink fluids"],
        },
      ],
    },
    {
      category: "Mental Health (Psychiatry)",
      diseases: [
        {
          name: "Depression",
          symptoms: [
            "Constant sadness",
            "No interest in activities",
            "Sleep problems",
          ],
          treatments: ["Counseling", "Medicines"],
        },
        {
          name: "Anxiety",
          symptoms: ["Restlessness", "Sweating", "Fast heartbeat"],
          treatments: ["Therapy", "Medicines"],
        },
        {
          name: "Schizophrenia",
          symptoms: ["Hearing voices", "False beliefs", "Confusion"],
          treatments: ["Strong medicines", "Therapy"],
        },
      ],
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
              Our Departments
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.2rem", color: "#374151" }}
            >
              Comprehensive healthcare services tailored to meet all your
              medical needs.
            </motion.p>
          </div>
        </motion.section>

        {/* Departments Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="departments-section py-5"
          style={{
            background: "#ffffff",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <div className="row">
              {departments.map((dept, index) => (
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
                      background: "#ffffff",
                      borderRadius: "15px",
                      padding: "30px 20px",
                      textAlign: "center",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <motion.i
                      whileHover={{ scale: 1.1 }}
                      className={`${dept.icon} fa-3x mb-3`}
                      style={{ color: "#10b981" }}
                    ></motion.i>
                    <h5
                      className="card-title fw-bold mb-3"
                      style={{ color: "#2563eb" }}
                    >
                      {dept.name}
                    </h5>
                    <p
                      className="card-text mb-3"
                      style={{ color: "#374151", fontSize: "0.95rem" }}
                    >
                      {dept.description}
                    </p>
                    <div className="services-list">
                      <h6
                        style={{
                          color: "#6b7280",
                          fontSize: "0.9rem",
                          marginBottom: "10px",
                        }}
                      >
                        Services Include:
                      </h6>
                      <ul
                        className="list-unstyled"
                        style={{ fontSize: "0.85rem", color: "#6b7280" }}
                      >
                        {dept.services.map((service, idx) => (
                          <li key={idx} className="mb-1">
                            <i
                              className="fas fa-check-circle me-2"
                              style={{
                                color: "#10b981",
                                fontSize: "0.7rem",
                              }}
                            ></i>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn mt-3"
                      style={{
                        background: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "25px",
                        padding: "8px 20px",
                      }}
                      onClick={() => {
                        if (dept.name === "Family Medicine") {
                          navigate("/family-medicine");
                        } else if (dept.name === "Female Health") {
                          navigate("/female-health");
                        } else if (dept.name === "Eye & Vision Services") {
                          navigate("/EyeVisionService");
                        } else if (dept.name === "Heart Science") {
                          navigate("/HeartScience");
                        }else if (dept.name === "Skin Health Department") {
                          navigate("/SkinHealthDepartment");
                        }else if (dept.name === "Child Health Services") {
                          navigate("/ChildHealthServices");
                        }
                        // baaki departments ke liye future me alag routes add kar sakte ho
                      }}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Common Diseases by Specialty */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="py-5"
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
              className="text-center h1 fw-bold mb-4"
              style={{ color: "#2563eb" }}
            >
              Common Diseases by Specialty
            </motion.h2>
            <p
              className="text-center mb-5"
              style={{ color: "#4b5563", fontSize: "0.95rem" }}
            >
              Simple view of important diseases, with their common symptoms and
              basic treatment options. You can also directly go to the
              prediction form from here.
            </p>

            <div className="row">
              {diseaseCategories.map((cat, index) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="col-lg-4 col-md-6 mb-4"
                >
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{
                      background: "#ffffff",
                      borderRadius: "15px",
                      padding: "20px 18px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <h5 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                      {cat.category}
                    </h5>
                    {cat.diseases.map((dis) => (
                      <div
                        key={dis.name}
                        className="mb-3"
                        style={{
                          borderBottom: "1px dashed #e5e7eb",
                          paddingBottom: "10px",
                        }}
                      >
                        <h6
                          className="fw-semibold mb-1"
                          style={{ color: "#111827" }}
                        >
                          {dis.name}
                        </h6>
                        <p
                          className="mb-1"
                          style={{
                            fontSize: "0.85rem",
                            color: "#374151",
                          }}
                        >
                          <strong>Symptoms:</strong> {dis.symptoms.join(", ")}
                        </p>
                        <p
                          className="mb-2"
                          style={{
                            fontSize: "0.85rem",
                            color: "#374151",
                          }}
                        >
                          <strong>Treatments:</strong>{" "}
                          {dis.treatments.join(", ")}
                        </p>

                        {/* 🔗 Prediction Form Link Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-sm"
                          style={{
                            background: "#2563eb",
                            color: "#ffffff",
                            borderRadius: "20px",
                            padding: "4px 14px",
                            fontSize: "0.8rem",
                            border: "none",
                          }}
                          onClick={() =>
                            navigate("/DiseasePredictionForm", {
                              state: { diseaseName: dis.name },
                            })
                          }
                        >
                          Check Now
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="why-choose-section py-5"
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
              Why Choose Our Departments?
            </motion.h2>
            <div className="row">
              {[
                {
                  icon: "fas fa-user-md",
                  title: "Expert Specialists",
                  description:
                    "Our departments are led by board-certified specialists with years of experience.",
                },
                {
                  icon: "fas fa-microscope",
                  title: "Advanced Technology",
                  description:
                    "State-of-the-art equipment and cutting-edge medical technology for accurate diagnoses.",
                },
                {
                  icon: "fas fa-clock",
                  title: "24/7 Care",
                  description:
                    "Round-the-clock emergency services and urgent care when you need it most.",
                },
                {
                  icon: "fas fa-heart",
                  title: "Patient-Centered Care",
                  description:
                    "Personalized treatment plans tailored to your unique health needs and preferences.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="col-lg-3 col-md-6 mb-4"
                >
                  <div className="text-center">
                    <motion.i
                      whileHover={{ scale: 1.1 }}
                      className={`${feature.icon} fa-3x mb-3`}
                      style={{ color: "#10b981" }}
                    ></motion.i>
                    <h5 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                      {feature.title}
                    </h5>
                    <p style={{ color: "#374151", fontSize: "0.95rem" }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
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
              className="h1 fw-bold mb-4"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lead mb-4"
              style={{ fontSize: "1.2rem" }}
            >
              Schedule an appointment with one of our specialized departments
              today.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-light btn-lg me-3"
              style={{
                borderRadius: "25px",
                padding: "12px 30px",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/BookAppointment")}
            >
              <i className="fas fa-calendar-alt me-2"></i>
              Book Appointment
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-outline-light btn-lg"
              style={{
                borderRadius: "25px",
                padding: "12px 30px",
                fontWeight: "bold",
              }}
            >
              <i className="fas fa-phone me-2"></i>
              Call Now
            </motion.button>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default Department;
