import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./Images/LogoFinal.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="main">
        <nav className="navbar navbar-expand-lg navbar-custom">
          <div className="container-fluid">
            <a
              className="navbar-brand logo"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                window.location.reload();
              }}
            >
              <img
                src={logo}
                alt="Medicust Logo"
                style={{ height: "80px", width: "120px", borderRadius: "8px" }}
              />
            </a>

            <button
              className="navbar-toggler bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse justify-content-center"
              id="navbarNav"
            >
              <ul className="navbar-nav">
                {[
                  "HOME",
                  "ABOUT",
                  "DEPARTMENT",
                  "PAGES",
                  "BLOG",
                  "CONTACT",
                ].map((item, index) => (
                  <li className="nav-item mx-2" key={index}>
                    <a
                      className="nav-link fw-semibold text-uppercase px-3"
                      href="#"
                      style={{
                        color: "#0D47A1",
                        transition: "all 0.3s ease",
                        letterSpacing: "0.8px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#00796B";
                        e.target.style.transform = "scale(1.1)";
                        e.target.style.textShadow = "0 2px 6px rgba(0,0,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "#0D47A1";
                        e.target.style.transform = "scale(1)";
                        e.target.style.textShadow = "none";
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* <div className="d-flex">
              <button className="btn btn-light text-primary fw-bold fs-6 fs-sm-5 fs-md-4 fs-lg-3 fs-xl-2">
                Login
              </button>
            </div> */}

            <div className="d-flex">
              <button
                className="btn btn-light text-primary fw-bold fs-6 fs-sm-5 fs-md-4 fs-lg-3 fs-xl-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>
        </nav>

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
              <p className="par">
                Empowering you with AI-driven health insights — predict,
                prevent, and stay ahead of diseases using your past health data.
              </p>
              <a href="#" className="cn">
                All appointment
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light text-primary text-center fw-bold p-3 rounded">
        <p>
          Need a Doctor for Checkup! <br /> Contact US with Emergency Number !
        </p>
      </div>
    </>
  );
}

export default Navbar;
