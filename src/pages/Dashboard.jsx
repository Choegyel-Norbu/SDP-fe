import React, { useState, useEffect, useRef } from "react";
import "../assets/css/Dashboard.css";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";

export default function Dashboard() {
  const [role, setRole] = useState("Admi");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const navRef = useRef(null);

  const toggleMobileNav = (e) => {
    e.stopPropagation();
    setShowMobileNav(!showMobileNav);
  };

  const handleClickOutside = (e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setShowMobileNav(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard-container">
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
          <span className="nav-item">Chogyal</span>
          <div className="profile-avatar"></div>
        </div>
      </nav>
      <div onClick={() => setShowMobileNav(false)}>
        {role === "Admin" ? <AdminDashboard /> : <ClientDashboard />}
      </div>
    </div>
  );
}
