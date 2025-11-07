import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Button from "./UserButton";

function Departments() {
  return (
    <>
      <div className="bg-white text-center p-3 rounded">
        <p className="h1 text-primary fw-bold">
          Welcome to the Health Diagnosis & Prediction System
        </p>
        <p>
          Health challenges may be tough, but your past data can
          lead to better outcomes. Don't lose hope temporary - struggles often
          lead to lasting wellness. Stay informed, stay proactive!
        </p>

        {/* <div className="container text-center mt-4">
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="border border-warning p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                <i
                  className="fas fa-heartbeat"
                  style={{ fontSize: "48px", color: "red" }}
                ></i>
                <a
                  className="link-opacity-100 text-decoration-none mt-2"
                  href="#"
                >
                  Cardiology
                </a>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="border border-warning p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                <i
                  className="fas fa-eye"
                  style={{ fontSize: "40px", color: "#198754" }}
                ></i>
                <a
                  className="link-opacity-100 text-decoration-none mt-2"
                  href="#"
                >
                  Ophthalmology
                </a>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="border border-warning p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                <i className="fas fa-female fa-3x text-danger"></i>
                <a
                  className="link-opacity-100 text-decoration-none mt-2"
                  href="#"
                >
                  Gynaecology
                </a>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="border border-warning p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                <i className="fas fa-tooth text-info fs-1"></i>
                <a
                  className="link-opacity-100 text-decoration-none mt-2"
                  href="#"
                >
                  Dental Care
                </a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="border border-warning p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-emoji-smile-fill fs-1 text-primary"></i>
                <a
                  className="link-opacity-100 text-decoration-none mt-2"
                  href="#"
                >
                  Face Surgery
                </a>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="border border-warning p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                <i className="fa-solid fa-syringe fs-1 text-secondary"></i>
                <a
                  className="link-opacity-100 text-decoration-none mt-2"
                  href="#"
                >
                  Pediatrics
                </a>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="border border-warning p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                <i className="fa-solid fa-star-of-life fs-1 text-success"></i>
                <a
                  className="link-opacity-100 text-decoration-none mt-2"
                  href="#"
                >
                  Gastrology
                </a>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="border border-warning p-3 h-100 d-flex flex-column justify-content-center align-items-center">
                <i className="fa-solid fa-user-nurse fs-1 text-dark"></i>
                <a
                  className="link-opacity-100 text-decoration-none mt-2"
                  href="#"
                >
                  Neurology
                </a>
              </div>
            </div>
          </div>
        </div> */}
        <Button />
      </div>
    </>
  );
}

export default Departments;
