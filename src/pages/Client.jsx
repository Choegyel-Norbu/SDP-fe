import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Client.css";
import api from "../services/Api";
import { toast } from "react-toastify";
import categoriesData from "../data/ServiceCategories.json";
import Footer from "./Footer";
import { Alert } from "@mui/material";
import { useAuth } from "../services/AuthProvider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import AddOns from "../data/AddOns.json";
import Frequency from "../data/Frequency.json";

export default function Client() {
  const navigate = useNavigate();

  const { userId } = useAuth();
  const [serviceForm, setServiceForm] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [clientDetailSet, setClientDetailSet] = useState(false);
  const [showMenuItem, setShowMenuItem] = useState(false);

  const [clientSelectedService, setClientSelectedService] = useState(null);

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

  const clientSelectServiceCategory = (selected) => {
    console.log("Client selected service - " + selectedCategory.category);

    console.log("Client selected service - " + selected.name);
    setClientSelectedService(selected);
    setBookingDetail((prev) => ({
      ...prev,
      serviceRequest: {
        ...prev.serviceRequest,
        serviceName: selected.name,
        serviceType: selectedCategory.category,
        itemPrice: selected.rate,
      },
    }));
    setIsDialogOpen(false);
  };

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

  const [bookingDetail, setBookingDetail] = useState({
    serviceRequest: {
      serviceType: "",
      serviceName: "",
      itemPrice: "",
    },
    frequency: "",
    specialInstructions: "",
    promoCode: "",
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    addOns: [],
    timeStart: "",
    timeEnd: "",
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

  const [selectedAddOnIds, setSelectedAddOnIds] = useState(new Set());

  const handleToggleAddon = (addon) => {
    setSelectedAddOnIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(addon.name)) {
        newSet.delete(addon.name);
      } else {
        newSet.add(addon.name);
      }
      return newSet;
    });

    setBookingDetail((prev) => {
      const exists = prev.addOns.some((a) => a.name === addon.name);
      return {
        ...prev,
        addOns: exists
          ? prev.addOns.filter((a) => a.name !== addon.name) // remove
          : [...prev.addOns, addon], // add
      };
    });
    console.log("Add on addons ");
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
        setClientDetailSet(true);
        localStorage.setItem("clientDetailSet", "true");
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
    setBookingDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const initialBookingDetail = {
    serviceRequest: {
      serviceType: "",
      serviceName: "",
      itemPrice: "",
    },
    frequency: "",
    specialInstructions: "",
    startTime: "",
    endTime: "",
    promoCode: "",
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    addOns: [],
    timeStart: "",
    timeEnd: "",
  };

  const [review, setReview] = useState(true);
  const [reviewAmount, setReviewAmount] = useState({
    totalAmount: "",
    discountedAmount: "",
    amountAfterDiscount: "",
    discountDesc: "",
  });

  const handleBookingReview = async () => {
    console.log("Review booking .......");

    try {
      const payload = {
        ...bookingDetail,
        userId: userId,
        // requestedDate: utcDate.toISOString(), // Convert to ISO format
      };
      const res = await api.post("/reviewBooking", JSON.stringify(payload));
      console.log("Response price - " + res.data.priceAfterDiscount);
      console.log("Response description - " + res.data.description);
      console.log("Response discountedPrice - " + res.data.discountedPrice);
      setReviewAmount({
        totalAmount: res.data.totalAmount,
        discountedAmount: res.data.discountedPrice,
        amountAfterDiscount: res.data.amountAfterDiscount,
        discountDesc: res.data.description,
      });
      setReview(false);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookingConfirm = async () => {
    console.log("UserId from client page@@@- " + userId);

    try {
      const payload = {
        ...bookingDetail,
        userId: userId,
        // requestedDate: utcDate.toISOString(), // Convert to ISO format
      };
      const res = await api.post("/booking", JSON.stringify(payload));
      if (res.status === 200) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        setBookingDetail(initialBookingDetail);
        setSelectedAddOnIds(() => new Set());

        setReview(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(
          "We couldn’t submit your request. Please try again or contact support if the issue persists.",
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

  //  form validation

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    streetAddress: "",
    subarb: "",
    state: "",
    unit: "",
  });

  const validateClientDetails = () => {
    const newErrors = {};
    let isValid = true;

    if (!clientDetail.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (clientDetail.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    if (!clientDetail.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (clientDetail.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }

    if (!clientDetail.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^[\d\s+()-]{8,15}$/.test(clientDetail.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      handleNext();
    }
  };

  const handleFreqSelect = (freq) => {
    setBookingDetail((prev) => ({
      ...prev,
      frequency: freq,
    }));
    console.log("Frequenty @@@- " + bookingDetail.frequency);
    console.log("Frequenty @@@- " + freq);
  };

  const validateAddressDetails = () => {
    const newErrors = {};
    let isValid = true;

    if (!clientDetail.addressDTO.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
      isValid = false;
    }

    if (!clientDetail.addressDTO.subarb.trim()) {
      newErrors.subarb = "Suburb is required";
      isValid = false;
    }

    if (!clientDetail.addressDTO.state) {
      newErrors.state = "Please select a state";
      isValid = false;
    }
    if (!clientDetail.addressDTO.unit.trim()) {
      newErrors.unit = "Unit is required";
      isValid = false;
    }

    setErrors(newErrors);
    if (isValid) {
      submitClientDetailAddress();
    }
  };

  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuItem(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const toggleMenu = () => {
    setShowMenuItem((prev) => !prev);
  };

  return (
    <div>
      {showAlert && (
        <Alert variant="filled" severity="success" style={{ width: "100%" }}>
          Here is a gentle confirmation that your action was successful.
        </Alert>
      )}

      <header className="client-header-container">
        <div className="menu-toggle" onClick={toggleMenu} id="menuToggle">
          &#9776;
        </div>
        <div style={{ paddingRight: "2rem" }} className="title-container">
          <h1 className="title">Let’s Get Your Space Sparkling!</h1>
          <p className="subtitle">
            Tell us what you need, and we’ll take care of the rest. From
            spotless homes to sparkling venues, choose the cleaning service that
            fits your needs — fast, reliable, and tailored for you.
          </p>
        </div>
        <div style={{ width: "10%" }}>
          <nav
            className={`nav-links client-navLink ${showMenuItem ? "show" : ""}`}
            id="navLinks"
            ref={menuRef}
          >
            <a href="/">Home</a>
          </nav>
        </div>
      </header>

      <div className="service-category-container" id="services">
        <h2 className="service-title">Service Categories</h2>
        <p
          style={{
            fontSize: "14px",
            color: "#000",
            marginBottom: "2rem",
            padding: "15px",
          }}
        >
          Let’s start by selecting what type of cleaning you need today. Whether
          it's a sparkling kitchen or a spotless bathroom, choose the service
          that fits your needs best.
        </p>
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

      {clientSelectedService && (
        <div className="service-request-container">
          <div className="avail-section">
            <div>
              <div className="avail-details">
                <span className="avail-icon">
                  {clientSelectedService?.serviceIcon}
                </span>
                <p className="avail-service-name">
                  {clientSelectedService?.name}
                </p>
              </div>
              <div>
                <p className="avail-service-rate">
                  rate: ${clientSelectedService?.rate}
                </p>
              </div>
            </div>

            <div>
              <div className="booking-container">
                <div className="booking-step">
                  <>
                    <h2>Select Date & Time</h2>
                    <p>
                      Choose a date and time that works best for you. Our
                      professional cleaners will arrive promptly and handle the
                      rest
                    </p>
                    {/* <p>
                          Pick a convenient date and time for your cleaning.
                        </p> */}
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="description">
                          Select start date and time{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          id="serviceDateTime"
                          selected={
                            bookingDetail.startTime
                              ? new Date(bookingDetail.startTime)
                              : null
                          }
                          onChange={(date) => {
                            if (!date) return;

                            // Convert selected date (JS Date) from local timezone to UTC ISO string
                            const localDate = DateTime.fromJSDate(date, {
                              zone: "Asia/Thimphu",
                            });
                            console.log(
                              "Date time picked from picker - " + date
                            );

                            console.log(
                              "Date time to local time - " + localDate
                            );
                            const utcDateISO = localDate.toUTC().toISO();

                            setBookingDetail((prev) => ({
                              ...prev,
                              startTime: utcDateISO, // Save as ISO UTC string
                            }));
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          minDate={new Date()}
                          placeholderText="Select end date and time"
                          className="date-picker-input"
                          required
                        />

                        {/* <DatePicker
                              selected={bookingDetail.timeStart}
                              onChange={(date) =>
                                setBookingDetail((prev) => ({
                                  ...prev,
                                  timeStart: date,
                                }))
                              }
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                              className="date-picker-input"
                              placeholder="Select time"
                            /> */}
                      </div>
                      <div className="form-group">
                        <label htmlFor="description">
                          Select end date and time
                          <span style={{ color: "red" }}>*</span>
                        </label>

                        <DatePicker
                          id="serviceDateTime"
                          selected={
                            bookingDetail.endTime
                              ? new Date(bookingDetail.endTime)
                              : null
                          }
                          onChange={(date) => {
                            if (!date) return;

                            // Convert selected date (JS Date) from local timezone to UTC ISO string
                            const localDate = DateTime.fromJSDate(date, {
                              zone: "Asia/Thimphu",
                            });
                            console.log(
                              "Date time picked from picker - " + date
                            );

                            console.log(
                              "Date time to local time - " + localDate
                            );
                            const utcDateISO = localDate.toUTC().toISO();

                            setBookingDetail((prev) => ({
                              ...prev,
                              endTime: utcDateISO, // Save as ISO UTC string
                            }));
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          minDate={new Date()}
                          placeholderText="Select end date and time"
                          className="date-picker-input"
                          required
                        />
                        {/* <DatePicker
                              selected={bookingDetail.timeEnd}
                              onChange={(date) =>
                                setBookingDetail((prev) => ({
                                  ...prev,
                                  timeEnd: date,
                                }))
                              }
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                              className="date-picker-input"
                            /> */}
                      </div>
                    </div>
                  </>
                </div>
              </div>

              {selectedCategory?.category === "Residential Cleaning" && (
                <div className="booking-container">
                  <div className="booking-step">
                    <h2>How many bedrooms and bathrooms?</h2>
                    <p style={{ marginBottom: "2rem" }}>
                      Let us know the size of your home so we can tailor the
                      cleaning service. Select the number of bedrooms and
                      bathrooms to get the most accurate estimate.{" "}
                      <span style={{ color: "red" }}>*</span>
                    </p>
                    <select
                      id="bedrooms"
                      value={bookingDetail.numberOfBedrooms}
                      onChange={(e) =>
                        setBookingDetail((prev) => ({
                          ...prev,
                          numberOfBedrooms: e.target.value,
                        }))
                      }
                      className="select-native"
                    >
                      <option value="">Select Bedrooms</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4">4 Bedrooms</option>
                      <option value="5">5+ Bedrooms</option>
                    </select>
                    <select
                      id="bathrooms"
                      value={bookingDetail.numberOfBathrooms}
                      onChange={(e) =>
                        setBookingDetail((prev) => ({
                          ...prev,
                          numberOfBathrooms: e.target.value,
                        }))
                      }
                      className="select-native"
                    >
                      <option value="">Select Bathrooms</option>
                      <option value="1">1 Bathroom</option>
                      <option value="2">2 Bathrooms</option>
                      <option value="3">3 Bathrooms</option>
                      <option value="4">4 Bathrooms</option>
                      <option value="5">5+ Bathrooms</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="booking-container">
                <div className="booking-step">
                  <h2>How ofter?</h2>

                  <p style={{ marginBottom: "2rem" }}>
                    Looking for a one-time deep clean or a recurring service?
                    Pick how often you'd like our team to visit.{" "}
                    <span style={{ color: "red" }}>*</span>
                  </p>
                  <ul className="frequency-list">
                    {Frequency.map((freq) => (
                      <li
                        key={freq.value}
                        className={`frequency-option ${
                          bookingDetail.frequency === freq.value
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleFreqSelect(freq.value)}
                      >
                        {freq.label}
                        {freq.discount && (
                          <span className="percent-off">- {freq.discount}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="booking-container">
                <div className="booking-step">
                  <h2>Special Instructions</h2>

                  <p style={{ marginBottom: "2rem" }}>
                    Got any specific areas to focus on or special instructions
                    for our cleaners? Leave us a note!{" "}
                    <span style={{ color: "red" }}>*</span>
                  </p>
                  <textarea
                    id="description"
                    name="specialInstructions"
                    value={bookingDetail.specialInstructions}
                    onChange={handleChange}
                    rows="4"
                    className="special-instr"
                    placeholder="Please describe the service you need in detail..."
                  />
                </div>
              </div>

              <div className="booking-container">
                <div className="booking-step">
                  <h2>Promo code?</h2>

                  <p style={{ marginBottom: "2rem" }}>
                    Have a discount code? Apply it here and enjoy some savings
                    on your service.
                  </p>
                  <input
                    type="text"
                    id="serviceName"
                    name="promoCode"
                    value={bookingDetail.promoCode}
                    onChange={handleChange}
                    className="date-picker-input promo-code"
                    placeholder="Enter promo code"
                  />
                </div>
              </div>

              <div className="booking-container">
                <div className="booking-step">
                  <h2>AddOns?</h2>

                  <p style={{ marginBottom: "2rem" }}>
                    Want to go the extra mile? Select additional services like
                    deep oven or fridge cleaning to give your space a full
                    refresh.
                  </p>
                  <div className="addon-section">
                    <h2 className="addon-title"> Enhance Your Cleaning</h2>
                    <div className="addon-grid">
                      {AddOns.map((addon) => {
                        const isSelected = selectedAddOnIds.has(addon.name);
                        return (
                          <div
                            key={addon.name}
                            className={`addon-card ${
                              isSelected ? "addon-card-selected" : ""
                            }`}
                          >
                            <div className="addon-name">{addon.name}</div>
                            <div className="addon-description">
                              {addon.description}
                            </div>
                            <div className="addon-price">${addon.price}</div>
                            <button
                              className={`addon-toggle ${
                                isSelected ? "addon-toggle-selected" : ""
                              }`}
                              onClick={() => handleToggleAddon(addon)}
                            >
                              {isSelected ? "Added" : "Add"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review booking  */}

            {!review && (
              <div className="booking-review">
                <h2>Review Your Booking</h2>

                <div className="review-row">
                  <span className="label">Service:</span>
                  <span>{bookingDetail.serviceRequest.serviceName}</span>
                </div>

                <div className="review-row">
                  <span className="label">Start Time:</span>
                  <span>
                    {bookingDetail.timeStart
                      ? bookingDetail.timeStart.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not selected"}
                  </span>
                </div>

                <div className="review-row">
                  <span className="label">End Time:</span>
                  <span>
                    {bookingDetail.timeEnd
                      ? bookingDetail.timeEnd.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not selected"}
                  </span>
                </div>

                <div className="review-row">
                  <span className="label">Frequency:</span>
                  <span>{bookingDetail.frequency}</span>
                </div>

                <div className="review-row">
                  <span className="label">Special Instructions:</span>
                  <span>{bookingDetail.specialInstructions || "None"}</span>
                </div>

                <div className="review-row review-addons">
                  <span className="label">Add-ons:</span>
                  <ul>
                    {bookingDetail.addOns.length > 0 ? (
                      bookingDetail.addOns.map((addon, idx) => (
                        <li key={idx}>
                          {addon.name} - ${addon.price}
                        </li>
                      ))
                    ) : (
                      <li>None</li>
                    )}
                  </ul>
                </div>

                <hr />

                <div className="review-row total">
                  <span className="label">Total Amount:</span>
                  <span>${reviewAmount.totalAmount}</span>
                </div>

                <div className="review-row discount">
                  <span className="label">Discount:</span>
                  <span>- ${reviewAmount.discountedAmount}</span>
                </div>

                <div className="review-row final-amount">
                  <span className="label">Amount After Discount:</span>
                  <span>${reviewAmount.amountAfterDiscount}</span>
                </div>

                <div className="review-row">
                  <span className="label">Discount Description:</span>
                  <span>{reviewAmount.discountDesc || "—"}</span>
                </div>
              </div>
            )}

            {review && (
              <p style={{ fontSize: "14px", color: "#555" }}>
                Almost done! Take a moment to review your details and confirm
                your booking. We’ll send you a confirmation once it’s locked
                in."
              </p>
            )}
            <div className="booking-action-btn">
              <div className="confirm-booking" onClick={handleBookingReview}>
                Review
              </div>
              {!review && (
                <div className="confirm-booking" onClick={handleBookingConfirm}>
                  Confirm Booking
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* {localStorage.getItem("clientDetailSet") !== "true" && (
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
                    {errors.firstName && (
                      <span className="validation-error-message">
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Last Name:</label>
                    <input
                      type="text"
                      name="lastName"
                      value={clientDetail.lastName}
                      onChange={handleChangeDetail}
                    />
                    {errors.lastName && (
                      <span className="validation-error-message">
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={clientDetail.phoneNumber}
                      onChange={handleChangeDetail}
                    />
                    {errors.phoneNumber && (
                      <span className="validation-error-message">
                        {errors.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-navigation">
                  <button
                    type="button"
                    className="next-btn"
                    onClick={validateClientDetails}
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
                    {errors.streetAddress && (
                      <span className="validation-error-message">
                        {errors.streetAddress}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Subarb</label>
                    <input
                      type="text"
                      name="subarb"
                      value={clientDetail.addressDTO.subarb}
                      onChange={handleChangeAddress}
                    />
                    {errors.subarb && (
                      <span className="validation-error-message">
                        {errors.subarb}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={clientDetail.addressDTO.state}
                      onChange={handleChangeAddress}
                    />
                    {errors.state && (
                      <span className="validation-error-message">
                        {errors.state}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <input
                      type="text"
                      name="unit"
                      value={clientDetail.addressDTO.unit}
                      onChange={handleChangeAddress}
                    />
                    {errors.unit && (
                      <span className="validation-error-message">
                        {errors.unit}
                      </span>
                    )}
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
                    onClick={validateAddressDetails}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )} */}

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
                  <div
                    key={i}
                    className="avail-service-item"
                    onClick={() => clientSelectServiceCategory(service)}
                  >
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
