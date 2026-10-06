import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./Images/LogoFinal.png";
import newlog from "./swastha.png";
import { apiRequest } from "../api";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");

  const refreshUnreadCount = useCallback(async () => {
    try {
      const result = await apiRequest("/api/notifications/unread-count");
      setUnreadCount(result.data.count);
      setNotificationsError("");
    } catch (error) {
      setNotificationsError(error.message);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      const [notificationResult, countResult] = await Promise.all([
        apiRequest("/api/notifications"),
        apiRequest("/api/notifications/unread-count"),
      ]);
      setNotifications(notificationResult.data);
      setUnreadCount(countResult.data.count);
      setNotificationsError("");
    } catch (error) {
      setNotificationsError(error.message);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

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

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setNotificationsError("");
      return undefined;
    }

    refreshUnreadCount();
    const intervalId = window.setInterval(refreshUnreadCount, 60000);
    return () => window.clearInterval(intervalId);
  }, [user, refreshUnreadCount]);

  const toggleNotifications = () => {
    const shouldOpen = !notificationsOpen;
    setNotificationsOpen(shouldOpen);
    if (shouldOpen) refreshNotifications();
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiRequest(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((current) => Math.max(0, current - 1));
      setNotificationsError("");
    } catch (error) {
      setNotificationsError(error.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      setNotificationsError("");
    } catch (error) {
      setNotificationsError(error.message);
    }
  };

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout request failed:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setNotificationsOpen(false);
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
              alt="SwasthaLife"
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
  <div className="d-flex align-items-center gap-3 navbar-user-actions">
    <div className="notification-container">
      <button
        className="notification-bell"
        type="button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={notificationsOpen}
        onClick={toggleNotifications}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {notificationsOpen && (
        <section className="notification-menu" aria-label="Notifications">
          <div className="notification-menu-header">
            <h2>Notifications</h2>
            <button
              className="notification-refresh"
              type="button"
              onClick={refreshNotifications}
              aria-label="Refresh notifications"
            >
              Refresh
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              className="notification-mark-all"
              type="button"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
          {notificationsLoading ? (
            <p className="notification-state" role="status">Loading notifications...</p>
          ) : notificationsError ? (
            <p className="notification-state notification-error" role="alert">
              {notificationsError}
            </p>
          ) : notifications.length === 0 ? (
            <p className="notification-state">You have no notifications.</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li
                  className={`notification-item${notification.read ? " is-read" : " is-unread"}`}
                  key={notification._id}
                >
                  <div className="notification-item-heading">
                    <strong>{notification.title}</strong>
                    {!notification.read && <span>New</span>}
                  </div>
                  <p>{notification.message}</p>
                  <time dateTime={notification.createdAt}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </time>
                  {!notification.read && (
                    <button
                      className="notification-mark-read"
                      type="button"
                      onClick={() => markAsRead(notification._id)}
                    >
                      Mark as read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
    {user.role === "ADMIN" && <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/admin")}>Admin</button>}
    {/* Profile (Photo ↑ Name ↓) */}
    <div
      className="text-center"
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/profile")}
    >
      <img
        src={user.profilePic ||
                  `https://ui-avatars.com/api/?name=${user.name}`}
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
