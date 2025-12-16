import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./Images/LogoFinal.png";
import newlog from "./swastha.png";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
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
          <div className="d-flex align-items-center">
            <img
              src={logo}
              alt="SwasthaLife Logo"
              style={{
                height: "50px",
                width: "50px",
                borderRadius: "8px",
                marginRight: "10px",
              }}
            />
            {/* <span className="project-name">SwasthaLife</span> */}
            {/* <span className="display-7 fw-bold text-primary text-gradient bg-gradient p-3 rounded shadow-lg">
              <span className="text-warning">Swastha</span>
              <span className="text-success">Life</span>
            </span> */}
            < img src={newlog} alt="SwasthaLife" style={{ height: "auto", width: "170px", borderRadius: "8px", marginRight: "10px"}} />
          </div>
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
              "DOCUMENTATIONS",
              "BLOG",
              "CONTACT",
            ].map((item, index) => {
              const isAccent = [
                "HOME",
                "ABOUT",
                "DEPARTMENT",
                // "PAGES",
                "DOCUMENTATIONS",
                "BLOG",
                "CONTACT",
              ].includes(item);
              return (
                <li className="nav-item mx-2" key={index}>
                  <a
                    className={`nav-link fw-semibold text-uppercase px-3 ${
                      isAccent ? "accent-link" : ""
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (item === "ABOUT") {
                        navigate("/about");
                      } else if (item === "HOME") {
                        navigate("/");
                      } else if (item === "DEPARTMENT") {
                        navigate("/department");
                      } else if (item === "DOCUMENTATIONS") {
                        navigate("/documentation");
                      }
                      // else if (item === "PAGES") {
                      //   navigate("/Pages");}
                      else if (item === "BLOG") {
                        navigate("/Blog");
                      } else if (item === "CONTACT") {
                        navigate("/contact");
                      } else {
                        // Handle other navigation items as needed
                      }
                    }}
                    style={{ letterSpacing: "0.8px", cursor: "pointer" }}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="d-flex ms-auto me">
          <button
            className="btn btn-light text-primary fw-bold fs-5 fs-sm-5 fs-md-4 fs-lg-3 fs-xl-2"
            onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
