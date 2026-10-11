import { motion as Motion } from "framer-motion";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Team.css";
import ashish from "./Images/Team/Ashish.png";
import Hardik1 from "./Images/Team/Hardik1.jpg";
import Tiwari from "./Images/Team/Tiwari.jpg";
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
      img: Tiwari,
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
      name: "Ansh Saxena",
      role: "UI/UX Designer",
      expert: "User Experience Design",
      desc: "Member4 focuses on creating intuitive designs, enhancing user interaction and accessibility in our health platform."
    }
  ];

  return (
    <>
      <section className="team-section text-center rounded-4">
        <h1 className="team-section__heading fw-bold mb-4">
          Meet our Team Members
        </h1>
        <p className="team-section__intro mb-5">
          At SwasthaLife, our multidisciplinary team of engineers, data
          scientists, and healthcare advisors develop AI-driven tools that help
          users understand symptoms and identify potential health risks.
        </p>

        <div className="container">
          <div className="row justify-content-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <Motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="card team-member-card h-100 border-0 shadow-sm"
                >
                  <div className="card-body d-flex flex-column align-items-center text-center p-4">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="team-member-image img-fluid rounded-circle mb-3"
                    />
                    <h5 className="card-title fw-bold" style={{ color: "#1e293b" }}>{member.name}</h5>
                    <p className="card-text mb-2" style={{ color: "#10b981", fontWeight: "600" }}>
                      Expert in {member.expert}
                    </p>
                    <p className="card-text" style={{ color: "#374151", fontSize: "0.9rem", lineHeight: "1.5" }}>
                      {member.desc}
                    </p>
                  </div>
                </Motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Teams;
