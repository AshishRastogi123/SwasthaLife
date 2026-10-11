import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";
import logo from "./Images/LogoFinal.png";
import newlog from "./swastha.png";
import { apiRequest } from "../api";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileNameVisible, setProfileNameVisible] = useState(false);
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
      await logout();
      setNotificationsOpen(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Unable to sign out. Please try again.");
    }
  };

  const notificationMenu = (
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
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand logo" to="/" aria-label="SwasthaLife home">
          <div className="navbar-brand-content">
            <img
              src={logo}
              alt=""
              className="navbar-brand-mark"
            />
            <img
              src={newlog}
              alt=""
              className="navbar-brand-wordmark"
            />
          </div>
        </Link>

        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse navbar-links"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {[
              ["HOME", "/"],
              ["ABOUT", "/about"],
              ["DEPARTMENT", "/department"],
              ["DOCUMENTATIONS", "/documentation"],
              ["BLOG", "/blog"],
              ["CONTACT", "/contact"],
            ].map((item, index) => (
              <li className="nav-item mx-2" key={index}>
                <Link
                  className="nav-link fw-semibold text-uppercase px-3 accent-link"
                  to={item[1]}
                >
                  {item[0]}
                </Link>
              </li>
            ))}
            {user && (
              <li className="nav-item mx-2 notifications-nav-item">
                <button
                  className="nav-link navbar-mobile-notifications fw-semibold text-uppercase px-3"
                  type="button"
                  aria-expanded={notificationsOpen}
                  onClick={toggleNotifications}
                >
                  <span className="navbar-mobile-notifications-label">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
                    </svg>
                    Notifications
                    {unreadCount > 0 && (
                      <span className="navbar-mobile-unread-count">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </span>
                </button>
                {notificationsOpen && notificationMenu}
              </li>
            )}
            {user && (
              <li className="nav-item mx-2">
                <button
                  className="nav-link navbar-logout-link fw-semibold text-uppercase px-3"
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="navbar-account-area">
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
      {notificationsOpen && notificationMenu}
    </div>
    {user.role === "ADMIN" && <button className="btn btn-outline-light btn-sm navbar-admin-button" type="button" onClick={() => navigate("/admin")}>Admin</button>}
    <button
      className="navbar-profile"
      type="button"
      aria-label={profileNameVisible ? "Hide profile name" : "Show profile name"}
      aria-expanded={profileNameVisible}
      onClick={() => setProfileNameVisible((visible) => !visible)}
    >
      {user.profilePic ? (
        <img
          src={user.profilePic}
          alt=""
          width="42"
          height="42"
          className="navbar-profile-image"
        />
      ) : (
        <span className="navbar-profile-initials" aria-hidden="true">
          {user.name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase()}
        </span>
      )}
      {profileNameVisible && <span className="navbar-profile-name">{user.name}</span>}
    </button>

  </div>
          ) : (
            <button
              className="btn btn-light text-primary fw-bold fs-8"
              type="button"
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
