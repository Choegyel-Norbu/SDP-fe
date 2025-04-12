import React, { useState } from "react";
import "../assets/css/Client.css";
import api from "../services/Api";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";
import axios from "axios";

export default function Client() {
  const [isClientSaved, setIsClientSaved] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    // Address Details
    street: "",
    city: "",
    state: "",
    zipCode: "",

    // Service Details
    serviceType: "",
    date: "",
    time: "",
    description: "",
  });

  //   const [clientAddress, setClientAddress] = useState({
  //     streetAddress: "",
  //     subarb: "",
  //     state: "",
  //     unit: "",
  //   });

  const [clientDetail, setClientDetail] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    phone: "",
    addressDTO: {
      streetAddress: "",
      subarb: "",
      state: "",
      unit: "",
    },
  });

  const [clientServiceDetail, setClientServiceDetail] = useState({
    serviceType: "",
    description: "",
    serviceName: "",
    description: "",
    repeatFrequency: "",
    priority: "",
  });

  const [currentSection, setCurrentSection] = useState(1);

  const handleChangeDetail = (e) => {
    const { name, value } = e.target;
    setClientDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeAddress = (e) => {
    const { name, value } = e.target;
    setClientDetail((prev) => ({
      ...prev,
      addressDTO: {
        ...prev.addressDTO,
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    setCurrentSection((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentSection((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Service request submitted successfully!");
  };

  const submitClientDetailAddress = async () => {
    setClientDetail((prev) => ({
      ...prev,
      userId: localStorage.getItem("userId"),
    }));
    console.log("User id before requesting " + localStorage.getItem("userId"));

    try {
      const res = await api.post("/addClient", JSON.stringify(clientDetail), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data === true) {
        toast.success("Your information has been successfully recorded.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
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
  };

  return (
    <div>
      <header className="header-container">
        <div>
          <h1 className="title">Service Request Form</h1>
          <p className="subtitle">
            Please provide your details so we can arrange the right service for
            you.
          </p>
        </div>
        <div className="contact-help">
          <p>
            Need help? <a href="/contact">Contact Support</a>
          </p>
        </div>
      </header>
      <div className="service-request-container">
        <div className="progress-indicator">
          <div className={`step ${currentSection >= 1 ? "active" : ""}`}>
            Client Details
          </div>
          <div className={`step ${currentSection >= 2 ? "active" : ""}`}>
            Address
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentSection === 1 && (
            <div className="form-section">
              <h2>Client Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={clientDetail.firstName}
                    onChange={handleChangeDetail}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={clientDetail.lastName}
                    onChange={handleChangeDetail}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    name="phone"
                    value={clientDetail.phone}
                    onChange={handleChangeDetail}
                    required
                  />
                </div>
              </div>
              <div className="form-navigation">
                <button type="button" className="next-btn" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}

          {currentSection === 2 && (
            <div className="form-section">
              <h2>Address</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={clientDetail.addressDTO.streetAddress}
                    onChange={handleChangeAddress}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subarb</label>
                  <input
                    type="text"
                    name="subarb"
                    value={clientDetail.addressDTO.subarb}
                    onChange={handleChangeAddress}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={clientDetail.addressDTO.state}
                    onChange={handleChangeAddress}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={clientDetail.addressDTO.unit}
                    onChange={handleChangeAddress}
                    required
                  />
                </div>
              </div>
              <div className="form-navigation">
                <button type="button" className="back-btn" onClick={handleBack}>
                  Back
                </button>
                <button
                  type="button"
                  className="next-btn"
                  onClick={submitClientDetailAddress}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>
              We’re a service delivery platform dedicated to helping people get
              trusted local services easily and reliably.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/services">Services</a>
              </li>
              <li>
                <a href="/pricing">Pricing</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>📍 Perth, Australia</p>
            <p>📞 +61 123 456 789</p>
            <p>📧 support@sdp.com</p>
          </div>

          <div className="footer-section">
            <h4>Subscribe</h4>
            <p>Stay updated with our latest services and offers.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SDP | All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
