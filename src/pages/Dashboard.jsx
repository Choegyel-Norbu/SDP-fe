import React, { useState, useEffect, useRef } from "react";
import "../assets/css/Dashboard.css";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";
import { useAuth } from "../services/AuthProvider";
import { Alert } from "@mui/material";

export default function Dashboard() {
  const { role } = useAuth();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const navRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);

  const toggleMobileNav = (e) => {
    e.stopPropagation();
    setShowMobileNav(!showMobileNav);
  };

  const handleClickOutside = (e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setShowMobileNav(false);
    }
  };

  const handleAlert = (message) => {
    setShowAlert(message);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    console.log("User role " + role);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard-container">
      {showAlert && (
        <Alert
          variant="filled"
          severity="success"
          style={{ position: "fixed", zIndex: "1", width: "100%" }}
        >
          Here is a gentle confirmation that your action was successful.
        </Alert>
      )}
      <nav className="navbar" ref={navRef}>
        {/* Left Side */}
        <div className="nav-left">
          <div className="project-info" onClick={toggleMobileNav}>
            <div className="avatar"></div>
            <span className="dashboard-label">Dashboard</span>
            <span className="badge">Unified</span>
          </div>

          <div
            className={`dashboard-nav-links ${
              showMobileNav ? "mobile-visible" : ""
            }`}
          >
            <a href="/">
              <span>Home</span>
            </a>
          </div>
        </div>

        {/* Right Side */}
        <div className="nav-right">
          <div className="profile-avatar"></div>
        </div>
      </nav>
      <div onClick={() => setShowMobileNav(false)}>
        {role === "ADMIN" ? (
          <AdminDashboard />
        ) : (
          <ClientDashboard onAlert={handleAlert} />
        )}
      </div>
    </div>
  );
}
