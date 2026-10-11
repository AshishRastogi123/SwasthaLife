import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PatientActions.css";

function UserButton() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Fill Your Data",
      desc: "Fill your health details for disease prediction.",
      img: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
      color: "#E3F2FD",
      path: "/form",
    },
    {
      title: "Our Departments",
      desc: "Explore different health departments and services.",
      img: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
      color: "#E8F5E9",
      path: "/department",
    },
    {
      title: "Use Our Chatbot",
      desc: "Talk with our AI assistant for quick health advice.",
      img: "https://cdn-icons-png.flaticon.com/512/4712/4712100.png",
      color: "#FFF3E0",
      path: "/chatbot",
    },
    {
      title: "Health History",
      desc: "Review your saved assessments, appointments, and care updates.",
      img: "https://cdn-icons-png.flaticon.com/512/3209/3209265.png",
      color: "#F3E8FF",
      path: "/health-history",
    },
  ];

  return (
    <section className="patient-action-section">
      <div className="container">
        <h1 className="patient-action-heading">Check Your Health</h1>
        <div className="row justify-content-center g-4">
          {cards.map((card, index) => (
            <div key={index} className="col-12 col-sm-6 col-xl-3 d-flex justify-content-center">
              <Motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(card.path)}
                className="card patient-action-card text-center shadow-sm border-0"
                style={{ backgroundColor: card.color }}
              >
                <img
                  src={card.img}
                  className="card-img-top p-4"
                  alt={card.title}
                  style={{ height: "clamp(130px, 18vw, 180px)", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{card.title}</h5>
                  <p className="card-text text-muted">{card.desc}</p>
                </div>
              </Motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UserButton;