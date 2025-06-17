import React, { useState, useEffect, useRef } from "react";
import "../assets/css/Dashboard.css";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";
import { useAuth } from "../services/AuthProvider";
import { Alert } from "@mui/material";
import ClientDetailsForm from "../components/ClientDetailsForm";
import { toast } from "react-toastify";
import api from "../services/Api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { role, userId, clientDetailSet, setclientDetailSet } = useAuth();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const navRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);

  const [formSubmitted, setFormSubmitted] = useState(false);

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
    console.log("Client details set CONTEXT@@@ - " + clientDetailSet);
    console.log(
      "Client details set LOCAL @@@ - " +
        localStorage.getItem("cleintDetailSet")
    );
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
        {/* <div className="nav-right">
          <div className="profile-avatar"></div>
        </div> */}
      </nav>
      {!clientDetailSet && (
        <ClientDetailsForm
          onComplete={async (clientDetail) => {
            console.log("Inside Dashboard from onComplete function......");
            const payload = {
              ...clientDetail,
              userId: userId,
            };

            try {
              const res = await api.post("/addClient", payload, {
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (res.status === 200) {
                setShowAlert(true);
                setTimeout(() => {
                  setShowAlert(false);
                }, 6000);
                // setclientDetailSet(true);
                navigate("/");
              } else {
                toast.error("Failed to recorded your information", {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "light",
                });
              }
            } catch (error) {
              console.error("Error saving client:", error);
            }
          }}
        />
      )}

      {clientDetailSet && (
        <div onClick={() => setShowMobileNav(false)}>
          {role === "ADMIN" ? (
            <AdminDashboard />
          ) : (
            <ClientDashboard onAlert={handleAlert} />
          )}
        </div>
      )}
    </div>
  );
}
