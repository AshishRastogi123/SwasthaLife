import React from "react";
import TypeWriter from "./TypeWriter";
import "./TypeWriter.css";
import EmergencyForm from "./EmergencyForm";

function Hero() {
  return (
    <div className="main">
      <div className="container text-start content">
        <div className="row">
          <div className="col-md-8">
            <h4>
              Medical And Health <br />
              <span>
                A professional <br />
                and Friendly care <br />
                provider.
              </span>
            </h4>
            <div className="par">
              <TypeWriter
                texts={[
                  "Empowering with AI-driven",
                  "Predict and prevent health",
                  "Your trusted healthcare"
                ]}
                delay={75}
                eraseDelay={50}
                pauseDuration={2000}
              />
            </div>
            <div className="button-group" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <a href="#" className="cn">
                <i className="fas fa-calendar-alt me-2"></i>
                Book Appointment
              </a>
              <button
                className="emergency-btn"
                onClick={() => {
                  const element = document.getElementById('emergency-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Additional offset for fixed header
                    setTimeout(() => {
                      window.scrollBy(0, -80); // Adjust scroll position to account for fixed header
                    }, 100);
                  }
                }}
              >
                <i className="fas fa-ambulance me-2"></i>
                Emergency
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
