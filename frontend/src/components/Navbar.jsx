import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./Images/LogoFinal.png";
import newlog from "./swastha.png";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🔹 Load user from localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();
    window.addEventListener("authChanged", loadUser);

    return () => window.removeEventListener("authChanged", loadUser);
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container-fluid">
        {/* LOGO */}
        <a
          className="navbar-brand logo"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
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
            <img
              src={newlog}
              alt="SwasthaLife"
              style={{
                height: "auto",
                width: "170px",
                borderRadius: "8px",
              }}
            />
          </div>
        </a>

        {/* TOGGLER */}
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV LINKS */}
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
            ].map((item, index) => (
              <li className="nav-item mx-2" key={index}>
                <span
                  className="nav-link fw-semibold text-uppercase px-3 accent-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (item === "HOME") navigate("/");
                    if (item === "ABOUT") navigate("/about");
                    if (item === "DEPARTMENT") navigate("/department");
                    if (item === "DOCUMENTATIONS") navigate("/documentation");
                    if (item === "BLOG") navigate("/blog");
                    if (item === "CONTACT") navigate("/contact");
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🔹 RIGHT SIDE (LOGIN / USER) */}
        <div className="d-flex align-items-center ms-auto">
         {user ? (
  <div className="d-flex align-items-center gap-3">
    {/* Profile (Photo ↑ Name ↓) */}
    <div
      className="text-center"
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/profile")}
    >
      <img
        src={user.profilePic || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
        alt="profile"
        width="42"
        height="42"
        className="rounded-circle mb-1"
        style={{ objectFit: "cover" }}
      />

      <div
        className="fw-semibold text-light"
        style={{ fontSize: "0.75rem", lineHeight: "1rem" }}
      >
        {user.name}
      </div>
    </div>

    {/* Logout */}
    <button
      className="btn btn-outline-light btn-sm"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
          ) : (
            <button
              className="btn btn-light text-primary fw-bold fs-8"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
