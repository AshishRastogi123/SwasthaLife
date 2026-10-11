import TypeWriter from "./TypeWriter";
import "./Hero.css";

function Hero() {
  return (
    <section className="home-hero">
      <div className="container home-hero__content">
        <div className="row">
          <div className="col-12 col-lg-8">
            <p className="home-hero__eyebrow">Medical and health</p>
            <h1 className="home-hero__title">
              Professional, friendly care <span>for a healthier life.</span>
            </h1>
            <div className="home-hero__lead">
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
            <div className="home-hero__actions">
              <a href="/BookAppointment" className="cn">
                <i className="fas fa-calendar-alt me-2"></i>
                Book Appointment
              </a>
              <a
                className="emergency-btn"
                href="#emergency-section"
                onClick={(event) => {
                  const element = document.getElementById("emergency-section");
                  if (element) {
                    event.preventDefault();
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                <i className="fas fa-ambulance me-2"></i>
                Emergency
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
