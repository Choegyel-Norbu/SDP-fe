import React, { useEffect, useState } from "react";
import "../assets/css/Client.css";
import api from "../services/Api";
import { toast } from "react-toastify";
import categoriesData from "../data/ServiceCategories.json";
import Footer from "./Footer";
import { Alert } from "@mui/material";
import { useAuth } from "../services/AuthProvider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";

export default function Client() {
  const { userId, loggedIn } = useAuth();

  const [serviceForm, setServiceForm] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [clientDetailSet, setClientDetailSet] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    const clientSetCall = async () => {
      const res = await api.get(`/clientSet/${userId}`);
      if (res.data) setClientDetailSet(true);
    };

    clientSetCall();

    setServiceCategories(categoriesData.serviceCategories);
  }, []);

  const [clientDetail, setClientDetail] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    addressDTO: {
      streetAddress: "",
      subarb: "",
      state: "",
      unit: "",
    },
  });

  const [clientServiceDetail, setClientServiceDetail] = useState({
    userId: "",
    serviceType: "",
    description: "",
    serviceName: "",
    repeatFrequency: "",
    priority: "",
    requestedDate: "",
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

  const submitClientDetailAddress = async () => {
    const payload = {
      ...clientDetail,
      userId: userId,
    };
    console.log("User id before requesting " + localStorage.getItem("userId"));

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
        setServiceForm(true);
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

  const handleCardClick = (category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientServiceDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceRequestSubmit = async () => {
    console.log("UserId from client page@@@- " + userId);

    try {
      const payload = {
        ...clientServiceDetail,
        userId: userId,
        requestedDate: clientServiceDetail.requestedDate.toISOString(), // Convert to ISO format
      };
      const res = await api.post("/serviceRequest", JSON.stringify(payload));
      if (res.status === 200) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        console.log("Successfully submitted");
      } else {
        toast.error(
          "Oops! We couldn’t submit your request. Please try again or contact support if the issue persists.",
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      }
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  return (
    <div>
      {showAlert && (
        <Alert
          variant="filled"
          severity="success"
          style={{ position: "fixed" }}
        >
          Here is a gentle confirmation that your action was successful.
        </Alert>
      )}

      <header className="header-container">
        <div>
          <h1 className="title">Service Request Form</h1>
          {serviceForm ? (
            <p className="subtitle">
              Share the service details to help us deliver exactly what you're
              looking for.
            </p>
          ) : (
            <p className="subtitle">
              Please provide your details so we can arrange the right service
              for you.
            </p>
          )}
        </div>
        <div className="contact-help">
          <p>
            Need help? <a href="/contact">Contact Support</a>
          </p>
        </div>
      </header>

      {/* {serviceForm && (
        
      )} */}

      {clientDetailSet ? (
        <form className="service-form">
          <div className="form-group">
            <label htmlFor="serviceType">Service Type</label>
            <select
              id="serviceType"
              name="serviceType"
              value={clientServiceDetail.serviceType}
              onChange={handleChange}
            >
              <option value="">Select a service type</option>
              <option value="cleaning">General Cleaning</option>
              <option value="maintenance">Kitchen Services</option>
              <option value="maintenance">Bathroom Services</option>
              <option value="maintenance">Window & Glasses</option>
              <option value="maintenance">Bedroom & Living Area</option>
              <option value="maintenance">Floor & Carpet</option>
              <option value="maintenance">Laundry Services</option>
              <option value="maintenance">Organization Help</option>
              <option value="maintenance">Garden & Outdoor</option>
              <option value="maintenance">Wall & Fixture</option>
              <option value="maintenance">Pet Related</option>
              <option value="maintenance">
                Elderly or Disability Support Service
              </option>
              <option value="maintenance">Miscellaneous</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="serviceName">Service Name</label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={clientServiceDetail.serviceName}
              onChange={handleChange}
              placeholder="e.g. Deep Cleaning, Electrical Repair"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="repeatFrequency">Repeat Frequency</label>
              <select
                id="repeatFrequency"
                name="repeatFrequency"
                value={clientServiceDetail.repeatFrequency}
                onChange={handleChange}
              >
                <option value="">Select frequency</option>
                <option value="Once">One-time</option>
                <option value="Weekly">Weekly</option>
                <option value="Fortnightly">Fortnightly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={clientServiceDetail.priority}
                onChange={handleChange}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={clientServiceDetail.description}
              onChange={handleChange}
              rows="4"
              placeholder="Please describe the service you need in detail..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Select date and time</label>
            <DatePicker
              id="serviceDateTime"
              selected={clientServiceDetail.requestedDate}
              onChange={(date) =>
                setClientServiceDetail((prev) => ({
                  ...prev,
                  requestedDate: date,
                }))
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15} // 15-minute intervals
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()} // Prevent past dates
              placeholderText="Select date and time"
              className="date-picker-input"
              required
            />
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleServiceRequestSubmit();
            }}
            className="submit-btn"
          >
            Submit Request
          </button>
        </form>
      ) : (
        <div className="service-request-container">
          <div className="progress-indicator">
            <div className={`step ${currentSection >= 1 ? "active" : ""}`}>
              Client Details
            </div>
            <div className={`step ${currentSection >= 2 ? "active" : ""}`}>
              Address
            </div>
          </div>

          <form>
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
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name:</label>
                    <input
                      type="text"
                      name="lastName"
                      value={clientDetail.lastName}
                      onChange={handleChangeDetail}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={clientDetail.phoneNumber}
                      onChange={handleChangeDetail}
                    />
                  </div>
                </div>
                <div className="form-navigation">
                  <button
                    type="button"
                    className="next-btn"
                    onClick={handleNext}
                  >
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
                    />
                  </div>
                  <div className="form-group">
                    <label>Subarb</label>
                    <input
                      type="text"
                      name="subarb"
                      value={clientDetail.addressDTO.subarb}
                      onChange={handleChangeAddress}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={clientDetail.addressDTO.state}
                      onChange={handleChangeAddress}
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <input
                      type="text"
                      name="unit"
                      value={clientDetail.addressDTO.unit}
                      onChange={handleChangeAddress}
                    />
                  </div>
                </div>
                <div className="form-navigation">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={handleBack}
                  >
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
      )}

      <div className="service-request-container" id="services">
        <h2 className="service-title">Categories</h2>
        <div className="categories-grid">
          {serviceCategories.map((item, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => handleCardClick(item)}
              onMouseEnter={() => setSelectedCategory(item)}
            >
              <h4 className="category-title">{item.category}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog Box */}
      <div
        className={`dialog-backdrop ${isDialogOpen ? "open" : ""}`}
        onClick={closeDialog}
      >
        <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={closeDialog}>
            ×
          </button>
          {selectedCategory && (
            <>
              <h3>{selectedCategory.category}</h3>
              <div className="services-list">
                {selectedCategory.services.map((service, i) => (
                  <div key={i} className="service-item">
                    <span className="service-icon">{service.icon}</span>
                    <span className="service-name">{service.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
