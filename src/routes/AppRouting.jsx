import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Client from "../pages/Client";
import { AuthProvider } from "../services/AuthProvider";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";

import About from "../pages/About";
import OTPVerification from "../pages/OTPVerification";
import LandingPage from "../pages/LandingPage";
import Service from "../pages/Service";

export default function () {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/client" element={<Client />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<Service />} />
      </Routes>
    </AuthProvider>
  );
}
