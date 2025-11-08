import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import ashish from "./Images/Team/Ashish.png";
import Hardik1 from "./Images/Team/Hardik1.jpg";
import Tiwari_photo from "./Images/Team/Tiwari_photo.jpg";
import manju from "./Images/Team/manju.jpg";

function Teams() {
  const teamMembers = [
    {
      img: ashish,
      name: "Ashish Kumar Rastogi",
      role: "Team Leader",
      expert: "AI/ML Engineering",
      desc: "Ashish leads the team with expertise in AI and machine learning, driving innovative solutions for health prediction and user engagement."
    },
    {
      img: Hardik1,
      name: "Hardik Agarwal",
      role: "Data Scientist",
      expert: "Data Science & Analytics",
      desc: "Hardik specializes in data analysis and predictive modeling, ensuring accurate health insights through advanced algorithms."
    },
    {
      img: Tiwari_photo,
      name: "Aditya Tiwari",
      role: "Software Engineer",
      expert: "Full-Stack Development",
      desc: "Aditya builds robust web applications, integrating AI models with user-friendly interfaces for seamless healthcare experiences."
    },
    {
      img: manju,
      name: "Manju Rajpoot",
      role: "Healthcare Advisor",
      expert: "Medical Informatics",
      desc: "Manju provides medical expertise, aligning our platform with clinical standards and ensuring trustworthy health recommendations."
    },
    {
      img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiga0kfrowvddqvuXCFSrMbKbyTroH85fnZfSFstoa4ldj_ZBuQq-1ohgp2gnvDOIvNj1pe0Jn1HAtTlNrHHLXqiLlHT_cj04dncQs7E7FQ1bjAZAXKhESXWAnYJVoSqVNfCbHJXCYlSq2TblWTFD4BSrb0gpaqWgW7xw2MBIHyFqb2PkM82FyZgU4bV7VK/s325/main-qimg-729a2f53e666804f98311e0c84515cd7-lq.jpeg",
      name: "Member4",
      role: "UI/UX Designer",
      expert: "User Experience Design",
      desc: "Member4 focuses on creating intuitive designs, enhancing user interaction and accessibility in our health platform."
    }
  ];

  return (
    <>
      <div
        className="text-center p-5 rounded-4  ml-2"
        style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #dbeafe 70%, #dcfce7 100%)",
          fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif",
          marginLeft: "25px",
          marginRight: "25px",
          
        
        }}
      >
        <h1
          className="fw-bold mb-4"
          style={{
            color: "#2563eb",
            fontSize: "2.8rem",
            fontWeight: "900"
          }}
        >
          Meet our Team Members
        </h1>
        <p
          className="mb-5"
          style={{
            fontSize: "1.1rem",
            color: "#374151",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}
        >
          At SwasthaLife, our multidisciplinary team of engineers, data
          scientists, and healthcare advisors develop AI-driven tools that help
          users understand symptoms and identify potential health risks.
        </p>

        <div className="container">
          <div className="row justify-content-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="card h-100 border-0 shadow-sm"
                  style={{
                    backgroundColor: "#e0f2fe",
                    borderRadius: "18px",
                    transition: "all 0.3s ease-in-out"
                  }}
                >
                  <div className="card-body d-flex flex-column align-items-center text-center p-4">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="img-fluid rounded-circle mb-3"
                      style={{ height: "150px", width: "150px", objectFit: "cover" }}
                    />
                    <h5 className="card-title fw-bold" style={{ color: "#1e293b" }}>{member.name}</h5>
                    <p className="card-text mb-2" style={{ color: "#10b981", fontWeight: "600" }}>
                      Expert in {member.expert}
                    </p>
                    <p className="card-text" style={{ color: "#374151", fontSize: "0.9rem", lineHeight: "1.5" }}>
                      {member.desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Teams;
