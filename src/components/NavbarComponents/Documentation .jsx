import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Documentation = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const diseases = [
    {
      name: "Diabetes (Type 2)",
      icon: "fas fa-syringe",
      shortDescription:
        "Diabetes is a condition where your body cannot control blood sugar properly. Either your body does not make enough insulin, or your cells stop responding to it.",
      symptoms: [
        "Feeling tired or low energy",
        "Increased thirst",
        "Frequent urination",
        "Blurred vision",
        "Slow healing of cuts or wounds",
        "Sudden weight loss or gain",
      ],
      effects: [
        "High sugar slowly damages nerves",
        "Can weaken eyesight and cause eye disease",
        "Increases risk of heart disease and stroke",
        "Can damage kidneys over time",
        "Foot infections and wounds heal very slowly",
      ],
      treatments: [
        "Daily exercise like walking, yoga, or cycling",
        "Diabetes medicines or insulin as prescribed by doctor",
        "Regular blood sugar monitoring at home or lab",
        "Maintaining healthy body weight",
        "Regular follow-up with doctor and eye check-ups",
      ],
      dietEat: [
        "Whole grains (roti, oats, brown rice)",
        "High-fiber vegetables and salads",
        "Leafy greens like spinach, methi, saag",
        "Nuts and seeds in small quantity",
        "Fruits like apple, papaya, guava, berries (in controlled amount)",
      ],
      dietAvoid: [
        "Sugary drinks (soda, cold drinks, sweet juices)",
        "Sweets, chocolates, cakes, pastries",
        "White rice and white bread",
        "Fried foods like samosa, kachori, chips",
        "Packaged snacks with high sugar or salt",
      ],
      prevention: [
        "Keep weight under control",
        "Do 30–45 minutes of physical activity daily",
        "Reduce sugar and refined food in diet",
        "Avoid too much sitting, move regularly",
        "Get regular blood sugar check-ups if you have family history",
      ],
    },
    {
      name: "High Blood Pressure (Hypertension)",
      icon: "fas fa-heartbeat",
      shortDescription:
        "High BP means blood is pushing too hard against your blood vessels. Over time, this pressure damages your heart, brain, and kidneys.",
      symptoms: [
        "Headache (especially in the morning)",
        "Dizziness or light-headed feeling",
        "Chest tightness or discomfort",
        "Shortness of breath",
        "Sometimes nosebleeds",
        "Often there are no symptoms – that’s why it is called a silent killer",
      ],
      effects: [
        "Heart has to work harder and becomes weak",
        "Higher chance of heart attack and heart failure",
        "Increases risk of stroke",
        "Can damage kidneys and reduce kidney function",
        "Can cause vision problems due to eye blood vessel damage",
      ],
      treatments: [
        "Regular BP medicines as prescribed by doctor",
        "Stress control through relaxation and sleep",
        "Regular walking or light exercise",
        "Low-salt diet and avoiding junk food",
        "Stopping smoking and limiting alcohol (if used)",
      ],
      dietEat: [
        "Fresh fruits like banana, orange, apple",
        "Green vegetables and salads",
        "Low-fat milk and curd",
        "Oats, brown rice, whole wheat roti",
        "Coconut water and plain water",
      ],
      dietAvoid: [
        "Excess salt in food",
        "Pickles, papad, sauces, instant soups",
        "Fried and oily foods",
        "Junk food and packaged namkeen",
        "Red meat and very heavy non-veg meals",
      ],
      prevention: [
        "Avoid long-term stress and anger",
        "Maintain healthy weight",
        "Reduce salt and fried food in diet",
        "Do daily walking or light exercise",
        "Get regular BP check-ups, especially after 35–40 years",
      ],
    },
    {
      name: "Asthma",
      icon: "fas fa-lungs",
      shortDescription:
        "Asthma is a condition where your airways become narrow, swollen, and produce mucus. This makes breathing difficult.",
      symptoms: [
        "Difficulty breathing",
        "Chest tightness or heaviness",
        "Wheezing sound while breathing",
        "Coughing, especially at night or early morning",
        "Feeling breathless after small activity or running",
      ],
      effects: [
        "Lungs become weak if asthma is not controlled",
        "Asthma attacks can become more frequent and severe",
        "Less oxygen reaches the body, causing tiredness",
        "Higher chance of emergency hospital visits",
        "Daily work, school, or exercise becomes difficult",
      ],
      treatments: [
        "Using inhalers (reliever + controller) as prescribed",
        "Breathing exercises (like deep breathing, pranayama)",
        "Steam inhalation in cold weather or congestion",
        "Avoiding dust, smoke, strong perfumes, and pollution",
        "Regular check-ups with chest specialist",
      ],
      dietEat: [
        "Warm water and herbal teas",
        "Ginger, turmeric, and honey (as advised)",
        "Fruits rich in Vitamin C like orange, amla, lemon",
        "Green leafy vegetables",
        "Omega-3 rich foods (walnuts, fish – if you eat non-veg)",
      ],
      dietAvoid: [
        "Cold drinks and very chilled water",
        "Ice cream and very cold desserts",
        "Fried and oily food",
        "Packaged snacks with too many preservatives",
        "Foods that you personally notice trigger your asthma",
      ],
      prevention: [
        "Stay away from dust, smoke, and strong chemicals",
        "Wear a mask in pollution or during cleaning",
        "Keep your room clean and well ventilated",
        "Avoid sudden weather changes when possible",
        "Do regular breathing exercises to keep lungs strong",
      ],
    },
    // You can easily add more diseases here later using the same structure
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
          className="py-5"
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
              className="display-4 fw-bold mb-3"
              style={{ color: "#2563eb" }}
            >
              Disease Documentation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lead"
              style={{ fontSize: "1.1rem", color: "#374151" }}
            >
              Simple, clear health information to help you understand each
              disease, its symptoms, treatment options, diet, and how you can
              protect yourself.
            </motion.p>
          </div>
        </motion.section>

        {/* How to Use This Page */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-5"
          style={{ background: "#ffffff", padding: "40px 20px" }}
        >
          <div className="container">
            <h2
              className="h4 fw-bold mb-3 text-center"
              style={{ color: "#2563eb" }}
            >
              How to Read This Page
            </h2>
            <p
              className="text-center mb-4"
              style={{ fontSize: "0.95rem", color: "#4b5563" }}
            >
              For every disease, we give you:
            </p>
            <div className="row text-center">
              {[
                "Disease Name and simple meaning",
                "Common symptoms you may feel",
                "How it affects your body if you ignore it",
                "Possible treatments and care options",
                "What to eat and what to avoid",
                "Easy prevention tips for daily life",
              ].map((item, index) => (
                <div key={index} className="col-md-4 mb-3">
                  <div className="card border-0 shadow-sm h-100 p-3">
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#374151",
                        marginBottom: 0,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p
              className="text-center mt-4"
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
              }}
            >
              <strong>Note:</strong> This information is for awareness and
              education. It does not replace a doctor. Always talk to a doctor
              for proper diagnosis and treatment.
            </p>
          </div>
        </motion.section>

        {/* Disease Cards */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e5f3ff 100%)",
            padding: "60px 20px",
          }}
        >
          <div className="container">
            <h2
              className="h3 fw-bold mb-4 text-center"
              style={{ color: "#2563eb" }}
            >
              Common Diseases Covered in Swastha Life
            </h2>
            <div className="row">
              {diseases.map((disease, index) => (
                <motion.div
                  key={disease.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="col-lg-4 col-md-6 mb-4"
                >
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{
                      borderRadius: "15px",
                      padding: "20px 18px",
                      background: "#ffffff",
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <i
                        className={`${disease.icon} fa-2x me-3`}
                        style={{ color: "#10b981" }}
                      ></i>
                      <div>
                        <h3
                          className="h5 fw-bold mb-1"
                          style={{ color: "#2563eb" }}
                        >
                          {disease.name}
                        </h3>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "0.85rem",
                            color: "#4b5563",
                          }}
                        >
                          {disease.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="mb-3">
                      <h4
                        className="h6 fw-bold mb-2"
                        style={{ color: "#111827" }}
                      >
                        Common Symptoms
                      </h4>
                      <ul
                        className="list-unstyled"
                        style={{ fontSize: "0.85rem", color: "#374151" }}
                      >
                        {disease.symptoms.map((symptom, i) => (
                          <li key={i} className="mb-1">
                            • {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Body Effects */}
                    <div className="mb-3">
                      <h4
                        className="h6 fw-bold mb-2"
                        style={{ color: "#111827" }}
                      >
                        How It Affects Your Body (If Not Treated)
                      </h4>
                      <ul
                        className="list-unstyled"
                        style={{ fontSize: "0.85rem", color: "#374151" }}
                      >
                        {disease.effects.map((effect, i) => (
                          <li key={i} className="mb-1">
                            • {effect}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Treatments */}
                    <div className="mb-3">
                      <h4
                        className="h6 fw-bold mb-2"
                        style={{ color: "#111827" }}
                      >
                        Possible Treatments & Care
                      </h4>
                      <ul
                        className="list-unstyled"
                        style={{ fontSize: "0.85rem", color: "#374151" }}
                      >
                        {disease.treatments.map((t, i) => (
                          <li key={i} className="mb-1">
                            • {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Diet */}
                    <div className="mb-3">
                      <h4
                        className="h6 fw-bold mb-2"
                        style={{ color: "#111827" }}
                      >
                        Recommended Diet
                      </h4>
                      <p
                        className="mb-1"
                        style={{
                          fontSize: "0.85rem",
                          color: "#111827",
                          fontWeight: 600,
                        }}
                      >
                        Foods to Eat:
                      </p>
                      <ul
                        className="list-unstyled mb-2"
                        style={{ fontSize: "0.85rem", color: "#374151" }}
                      >
                        {disease.dietEat.map((food, i) => (
                          <li key={i} className="mb-1">
                            • {food}
                          </li>
                        ))}
                      </ul>
                      <p
                        className="mb-1"
                        style={{
                          fontSize: "0.85rem",
                          color: "#111827",
                          fontWeight: 600,
                        }}
                      >
                        Foods to Avoid:
                      </p>
                      <ul
                        className="list-unstyled"
                        style={{ fontSize: "0.85rem", color: "#374151" }}
                      >
                        {disease.dietAvoid.map((food, i) => (
                          <li key={i} className="mb-1">
                            • {food}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div>
                      <h4
                        className="h6 fw-bold mb-2"
                        style={{ color: "#111827" }}
                      >
                        Prevention Tips
                      </h4>
                      <ul
                        className="list-unstyled"
                        style={{ fontSize: "0.85rem", color: "#374151" }}
                      >
                        {disease.prevention.map((tip, i) => (
                          <li key={i} className="mb-1">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Soft Disclaimer / Closing */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-5"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
            color: "#ffffff",
            textAlign: "center",
            padding: "50px 20px",
          }}
        >
          <div className="container">
            <h2 className="h4 fw-bold mb-3">
              Swastha Life is Your Health Guide, Not Your Doctor
            </h2>
            <p
              className="mb-0"
              style={{
                fontSize: "0.95rem",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              Our AI-based system helps you understand possible risks and gives
              you simple health tips. But for any serious or long-lasting
              problem, always visit a doctor or hospital. Your health is
              precious — never ignore warning signs.
            </p>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default Documentation;
