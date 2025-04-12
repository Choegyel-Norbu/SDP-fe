import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Client from "../pages/Client";
import { AuthProvider } from "../services/AuthProvider";

export default function () {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/client" element={<Client />} />
      </Routes>
    </AuthProvider>
  );
}
