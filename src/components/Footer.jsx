import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "./Images/Footer.png";

const Footer = () => {
  return (
    <section
      className="footer pt-5"
      style={{
        backgroundImage: { Image },
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
      }}
    >
      <footer className="text-center text-lg-start text-muted">
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom border-light">
          <div className="me-5 d-none d-lg-block">
            <span>Get connected with OUR Team on social networks:</span>
          </div>
          <div>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-google"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </section>

        <section>
          <div className="container text-center text-md-start mt-5">
            <div className="row mt-3">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  SwasthaLife India
                </h6>
                <div className="post1 col-lg-12 col-md-12 col-12 pb-4">
                  <img
                    className="img-fluid pb-3"
                    src="https://tse2.mm.bing.net/th/id/OIP.rE6sHUx7lLRfwLEnOOPi7gHaEd?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                    alt="SwasthaLife Logo"
                    style={{ borderRadius: "10px", width: "100px" }}
                  />
                </div>
                <p>
                  Empowering lives through innovation, our dedicated team built
                  a responsive website that predicts diseases—bringing
                  healthcare one step closer, faster, and smarter.
                </p>
              </div>

              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Departments</h6>
                <p>
                  <a href="#" className="text-reset">
                    Family Medicine
                  </a>
                </p>
                <p>
                  <a href="#" className="text-reset">
                    Female Health
                  </a>
                </p>
                <p>
                  <a href="#" className="text-reset">
                    Optician
                  </a>
                </p>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Useful Links</h6>
                <p>
                  <a href="#" className="text-reset">
                    Our Health Experts
                  </a>
                </p>
                <p>
                  <a href="#" className="text-reset">
                    Appointments
                  </a>
                </p>
                <p>
                  <a href="#" className="text-reset">
                    Our Helpers
                  </a>
                </p>
                <p>
                  <a href="#" className="text-reset">
                    Our Medicine
                  </a>
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">Contact Us</h6>
                <p>
                  <strong>Address:</strong> Invertis Village, Delhi Lucknow
                  Highway NH-24, Bareilly, Uttar Pradesh - 243123, India
                </p>
                <p>
                  <strong>Email:</strong> info@techteam.org
                </p>
                <p>
                  <strong>Phone:</strong>
                  <br />
                  +91 84456 31880 , +91 97560 21146
                </p>
              </div>
            </div>
          </div>
        </section>

        <div
          className="text-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            color: "#fff",
          }}
        >
          © 2025 techteamrights:{" "}
          <a className="text-reset fw-bold" href="#">
            techteamindia.in
          </a>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
