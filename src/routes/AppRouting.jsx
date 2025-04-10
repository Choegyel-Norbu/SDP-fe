import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import Navbar from "../components/Navbar";
import Login from "../pages/Login";
import LoginBootstrap from "../pages/LoginBootstrap";
import SignUp from "../pages/SignUp";

export default function () {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginBoots" element={<LoginBootstrap />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </Router>
  );
}
