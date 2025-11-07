import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
    conPassword: "",
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleValidate = (value) => {
    let errors = {};

    if (!value.email) {
      errors.email = "Email is required";
    }
    if (!value.password) {
      errors.password = "Password is required";
    }
    if (!value.conPassword) {
      errors.conPassword = "Confirm Password is required";
    } else if (value.password !== value.conPassword) {
      errors.conPassword = "Passwords do not match";
    }

    setError(errors);

    if (Object.keys(errors).length === 0) {
      if (
        value.email === "handsometiwariji@gmail.com" &&
        value.password === "Tiwariji123"
      ) {
        alert("Login Successful!");
        navigate("/");
      } else {
        alert("Invalid Email or Password");
      }
    }
  };

  const handleClick = () => {
    handleValidate(data);
  };

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #E3F2FD, #FCE4EC)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 d-flex flex-column align-items-center justify-content-center text-center bg-white shadow rounded-start p-4">
            <h4 className="fw-bold mb-3">An easy way to manage</h4>
            <h2 className="fw-bold text-primary mb-4">Your Health Online</h2>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
              alt="health"
              style={{ width: "80%", maxWidth: "250px" }}
            />
            <a href="/" className="mt-3 text-decoration-none fw-semibold">
              Go back
            </a>
          </div>

          <div className="col-md-5 bg-light shadow rounded-end p-4">
            <h4 className="text-center fw-bold mb-4">
              WelCome to SwathaLife Portal
            </h4>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="form-control"
                onChange={handleChange}
              />
              <p className="text-danger">{error.email}</p>
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="form-control"
                onChange={handleChange}
              />
              <p className="text-danger">{error.password}</p>
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="conPassword"
                placeholder="Confirm your password"
                className="form-control"
                onChange={handleChange}
              />
              <p className="text-danger">{error.conPassword}</p>
            </div>

            <div className="d-grid">
              <button
                className="btn btn-primary fw-semibold"
                onClick={handleClick}
              >
                Login
              </button>
            </div>

            <hr />
            <p className="text-center text-muted">Or Login with</p>

            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-outline-primary">
                <i className="bi bi-facebook me-2"></i> Facebook
              </button>
              <button className="btn btn-outline-info">
                <i className="bi bi-twitter me-2"></i> Twitter
              </button>
              <button className="btn btn-outline-primary">
                <i className="bi bi-linkedin me-2"></i> LinkedIn
              </button>
              <button className="btn btn-outline-danger">
                <i className="bi bi-google me-2"></i> Google
              </button>
            </div>

            <div className="text-center mt-3">
              <p>
                Don't have an account?
                <Link to="/Signup" className="text-decoration-none">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
