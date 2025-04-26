import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Custom.css";
import { useAuth } from "../services/AuthProvider";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Alert } from "@mui/material";
import api from "../services/Api";

export default function HomePage() {
  const navigate = useNavigate();
  const { loggedIn, logout, userId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [close, setClose] = useState(false);
  const [email, setEmail] = useState("");
  const [logoutDialog, setLogoutDialog] = useState(false);
  const footerRef = useRef(null);
  const dialogRef = useRef();
  const [showAlert, setShowAlert] = useState(false);
  const [loginState, setLoginState] = useState(false);
  const hasShownAlert = useRef(false); // Track if alert was shown
  const [clientDetailSet, setClientDetailSet] = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  });

  useEffect(() => {
    console.log("Triggered effect HOMEPAGE --------------");
    const clientSetCall = async () => {
      console.log("Inside client set -------");
      const res = await api.get(`/clientSet/${userId}`);
      if (res.data) setClientDetailSet(true);

      console.log("Client set status - " + res.data);
    };

    clientSetCall();
  }, []);

  const handleClickOutside = (e) => {
    // Check if the clicked element is inside the logout dialog
    const isInsideDialog = e.target.closest(".logout_dialog");

    // Check if the click was on the profile button (to prevent immediate closing)
    const isProfileButton = e.target.closest(".logout_icon");

    // Close the dialog if clicking outside (and not on the profile button)
    if (!isInsideDialog && !isProfileButton) {
      setLogoutDialog(false);
    }

    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      setLogoutDialog(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen(true);
    setClose(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setClose(false);
  };

  const profileDialog = () => {
    setLogoutDialog((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("Closing dialog");
    setLogoutDialog(false);
    console.log("Calling logout");
    logout();
  };

  return (
    <div>
      {showAlert && (
        // <Alert variant="filled" severity="success">
        //   Here is a gentle confirmation that your action was successful.
        // </Alert>
        <Alert severity="success">
          Here is a gentle confirmation that your action was successful.
        </Alert>
      )}
      <header className="container_info">
        <div className="header_logo d-flex flex-row align-items-center">
          <img
            src="https://i.pinimg.com/736x/71/b3/e4/71b3e4159892bb319292ab3b76900930.jpg"
            alt="Nature landscape with mountains"
            loading="lazy"
            decoding="async"
            title="Beautiful mountain scenery"
          />
          <div className="logo_desc">
            <h3 className="fw-bold" style={{ fontFamily: "cursive" }}>
              Service Delivery
            </h3>
            <p style={{ color: "#4d4d4d", fontSize: "14px" }}>
              Agency for domestic cleaner
            </p>
          </div>
        </div>
        <div className="contact-container">
          <div className="operating-hours">
            <p className="label">Operating Hours</p>
            <div>
              <p className="hour">Mon–Fri: 8AM–6PM</p>
              <p className="hour">Sat: 9AM–2PM</p>
            </div>
          </div>

          <div
            className="header_info d-flex flex-row align-items-center"
            onClick={scrollToFooter}
            style={{ cursor: "pointer" }}
          >
            <h5 className="fw-light info_call" style={{ color: "#4d4d4d" }}>
              📞 0411 598 851
            </h5>
          </div>
        </div>
      </header>

      <header className="navbar-custom">
        {close ? (
          <>
            <div className="menu-toggle" onClick={closeMenu} id="menuToggle">
              &#10005;
            </div>
          </>
        ) : (
          <div className="menu-toggle" onClick={toggleMenu} id="menuToggle">
            &#9776;
          </div>
        )}
        {/* <div className="menu-toggle" onClick={toggleMenu} id="menuToggle">
          &#9776;
        </div> */}
        <nav className={`nav-links ${isMenuOpen ? "show" : ""}`} id="navLinks">
          <a href="#">Home</a>
          <a href="/client#services">Services</a>
          <a href="/about">About</a>
          {/* <div
            className="cus-nav-item"
            onClick={toggleDropdown}
            onMouseEnter={() => setIsDropdownOpen(true)} // Show dropdown on hover
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <a href="#">Oppertunities</a>
            {isDropdownOpen && (
              <ul className={`cus-dropdown ${isDropdownOpen ? "open" : ""}`}>
                <li>
                  <a href="#">Web Development</a>
                </li>
                <li>
                  <a href="#">App Development</a>
                </li>
                <li>
                  <a href="#">SEO Services</a>
                </li>
              </ul>
            )}
          </div> */}
          <a href="#" onClick={scrollToFooter}>
            Contact
          </a>
        </nav>
        <div>
          {!loggedIn && (
            <>
              <span
                className="fa fa-user"
                style={{ marginRight: "8px", color: "#ff8000" }}
              ></span>
              <a href="/login" className="cus-anchor">
                Login/Register
              </a>
            </>
          )}
          {loggedIn && (
            <button
              onClick={profileDialog}
              className="logout_icon"
              style={{ cursor: "pointer", background: "none", border: "none" }}
            >
              <span
                className="fa fa-user"
                style={{
                  color: "#66b3ff",
                  backgroundColor: "#e6e6e6",
                  borderRadius: "50%",
                }}
              ></span>
            </button>
          )}
          <div
            className={`logout_dialog ${logoutDialog ? "show" : ""}`}
            ref={dialogRef}
          >
            <div>
              <span
                className="fa fa-envelope"
                style={{
                  color: "#66b3ff",
                }}
              ></span>
              <span style={{ marginLeft: "12px" }}>{email}</span>
            </div>
            <div>
              <span
                className="fa fa-chart-line"
                style={{
                  color: "#66b3ff",
                }}
              ></span>
              <button
                onClick={() =>
                  navigate(clientDetailSet ? "/dashboard" : "/client")
                }
              >
                Dashboard
              </button>
            </div>
            <div>
              <span
                className="fa fa-sign-out"
                style={{
                  color: "#66b3ff",
                }}
              ></span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <header className="hero">
        <div className="container text-center text-white py-5">
          <h1 className="display-5 fw-bold">
            Need Help with Household Tasks? Just Tell Us What You Need.
          </h1>
          <p className="lead mt-3">
            Post your service request and we’ll take care of the rest.
          </p>
          <a
            href={loggedIn ? "/client" : "/login"}
            // href="/client"
            className="cta-btn fw-bold mt-5 d-inline-block"
          >
            Schedule a Service
          </a>
        </div>
      </header>

      <section className="section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Popular Service Categories</h2>
            <p className="text-muted">
              Here are a few things you can request from us
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="icon-box p-4 shadow-sm bg-white rounded text-center">
                <h5>🧺 Laundry Pickup & Drop</h5>
              </div>
            </div>
            <div className="col-md-4">
              <div className="icon-box p-4 shadow-sm bg-white rounded text-center">
                <h5>🧼 Car Wash at Home</h5>
              </div>
            </div>
            <div className="col-md-4">
              <div className="icon-box p-4 shadow-sm bg-white rounded text-center">
                <h5>🧹 Deep Cleaning</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">How It Works</h2>
          <div className="row text-center">
            <div className="col-md-4">
              <h5>📋 Schedule a Request</h5>
              <p>Tell us what you need through our simple form.</p>
            </div>
            <div className="col-md-4">
              <h5>📞 Get Matched</h5>
              <p>We connect you with the right service provider.</p>
            </div>
            <div className="col-md-4">
              <h5>✅ Task Done</h5>
              <p>Our team fulfills the task at your scheduled time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Why Choose Us</h2>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVduQ2p3JqTng_hSCr4tXv7aB6N83-9xSmfA&s"
                  alt="Transparent Pricing"
                  className="card-img-top p-4"
                  style={{ height: "140px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">🔒 Reliable</h5>
                  <p className="card-text">
                    All our service providers go through a thorough verification
                    and background check process for your safety and peace of
                    mind.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <img
                  src="data:image/png;base64,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"
                  alt="Fast Response"
                  className="card-img-top p-4"
                  style={{ height: "140px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">⚡ Fast Response</h5>
                  <p className="card-text">
                    We handle your service requests quickly and efficiently — no
                    waiting, just fast action and reliable communication.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVduQ2p3JqTng_hSCr4tXv7aB6N83-9xSmfA&s"
                  alt="Transparent Pricing"
                  className="card-img-top p-4"
                  style={{ height: "140px", objectFit: "contain" }}
                />

                <div className="card-body">
                  <h5 className="card-title fw-bold">💰 Transparent Pricing</h5>
                  <p className="card-text">
                    You always know what you’re paying for. No hidden fees, no
                    last-minute surprises — just honest service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">What Our Clients Say</h2>
          <div className="row">
            <div className="col-md-4">
              <blockquote className="p-3 border rounded shadow-sm">
                “Booked laundry pickup, and it was a breeze! Highly recommend.”
                <footer className="mt-2 text-muted">— Sonam T., Thimphu</footer>
              </blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="p-3 border rounded shadow-sm">
                “Quick car wash without leaving home. Great service.”
                <footer className="mt-2 text-muted">— Tashi D., Paro</footer>
              </blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="p-3 border rounded shadow-sm">
                “The deep cleaning was super detailed. Will book again!”
                <footer className="mt-2 text-muted">
                  — Kinley N., Phuentsholing
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cta-section py-5 text-center text-white"
        style={{ backgroundColor: "#0077b6" }}
      >
        <div className="container">
          <h2 className="fw-bold">Ready to Get Started?</h2>
          <p>Post your request now and relax while we handle the rest!</p>
          <a href="#request" className="btn btn-light fw-bold mt-3 px-4 py-2">
            Post a Request
          </a>
        </div>
      </section>

      <section className="section py-5" ref={footerRef}>
        <div className="container">
          <h2 className="text-center fw-bold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq1"
                >
                  How do I post a request?
                </button>
              </h2>
              <div id="faq1" className="accordion-collapse collapse show">
                <div className="accordion-body">
                  Click on “Post a Request”, fill in your details and choose the
                  service.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq2"
                >
                  Can I reschedule a service?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse">
                <div className="accordion-body">
                  Yes, contact our team before the scheduled time and we’ll help
                  you reschedule.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer ref={footerRef} />

      <style>{`
        .hero {
          height: 70vh;
          background-image: url("https://res.akamaized.net/domain/image/upload/t_web/v1722308766/HighRes_Image_13_-_1V59FL1JZ59_Red_Hill_House_Studio_by_zuzananicholas_-_Photography_by_Clinton_Weaver_rrhvyq.jpg");
          background-size: cover; /* This makes the image cover the entire container */
          background-position: center; /* This centers the image */
          background-repeat: no-repeat;
        }
        .cta-btn {
          margin-top: 2rem;
          font-size: 1.1rem;
          padding: 12px 30px;
          border-radius: 50px;
          text-decoration: none;
          background-color: #fff;
          color: #0077b6; /* Initial text color */
          font-weight: bold;
          transition: transform 0.3s ease, background-color 0.3s ease,
            color 0.3s ease;
        }
        .cta-btn:hover {
          transform: scale(1.02); /* Slightly enlarge the button */
          background-color: #1a8cff; /* Change background color on hover */
          color: #fff; /* Change text color on hover */
        }
      `}</style>
    </div>
  );
}
