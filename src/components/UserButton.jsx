import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

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
      path: "/departments",
    },
    {
      title: "Use Our Chatbot",
      desc: "Talk with our AI assistant for quick health advice.",
      img: "https://cdn-icons-png.flaticon.com/512/4712/4712100.png",
      color: "#FFF3E0",
      path: "/chatbot",
    },
  ];

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #dbeafe 0%, #dbeafe 70%, #dcfce7 100%)",
        borderRadius: "18px",
        marginRight: "16px",
        marginLeft: "16px",
        marginBottom: "0px",
      }}
    >
      <div className="container">
        <h1 style={{ color: "#2446a3", textAlign: "center", marginBottom: "80px", fontSize: "2.8rem", fontWeight: "900" }}>Check Your Health</h1>
        <div className="row justify-content-center g-4">
          {cards.map((card, index) => (
            <div key={index} className="col-md-3 d-flex justify-content-center">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(card.path)}
                className="card text-center shadow-sm border-0"
                style={{
                  width: "18rem",
                  borderRadius: "18px",
                  cursor: "pointer",
                  backgroundColor: card.color,
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <img
                  src={card.img}
                  className="card-img-top p-4"
                  alt={card.title}
                  style={{ height: "180px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{card.title}</h5>
                  <p className="card-text text-muted">{card.desc}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserButton;