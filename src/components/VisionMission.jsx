
import React from "react";
import "./VisionMission.css";
import visionGif from "./Images/vision.gif";


const VisionMission = () => (
  <section className="vision-mission-section">
    <div className="vision-mission-flex">
      <div className="vision-mission-content">
        <h1 className="vision-mission-heading">Vision & Mission</h1>
        <h2 className="vision-title">Vision</h2>
        <div className="vision-text">
          Empowering every individual to take charge of their health through early prediction, prevention, and accessible care—anytime, anywhere. We envision a future where technology bridges the gap between people and medical expertise, making healthcare simple, proactive, and universally available.
        </div>
        <h2 className="mission-title">Mission</h2>
        <ul className="mission-list">
          <li>To harness the power of AI and digital innovation for early detection and prevention of diseases, helping people live healthier lives.</li>
          <li>To make healthcare guidance and disease information accessible and affordable for everyone, regardless of location or background.</li>
          <li>To provide a compassionate, human-centered virtual medical assistant that supports users with trustworthy advice and personalized care.</li>
          <li>To continuously expand our platform, offering online consultations, digital medical records, and a seamless virtual hospital experience.</li>
          <li>To foster medical awareness and empower communities to make informed decisions about their health and well-being.</li>
        </ul>
      </div>
      <div className="vision-mission-image">
  <img src={visionGif} alt="Vision" className="vision-gif" />
      </div>
    </div>
  </section>
);

export default VisionMission;
