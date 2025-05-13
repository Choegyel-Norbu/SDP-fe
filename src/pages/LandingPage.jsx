import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Landing.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";
import BiotechIcon from "@mui/icons-material/Science";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import {
  faArrowsSpin,
  faSliders,
  faUser,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

import serviceCategories from "../data/ServiceCategories.json";
import api from "../services/Api";
import Footer from "./Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const { loggedIn, email, logout, userId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const dialogRef = useRef();
  const [clientDetailSet, setClientDetailSet] = useState(false);

  const menuRef = useRef(null);
  const footerRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const profileDialog = () => {
    setLogoutDialog((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    console.log("Closing dialog");
    setLogoutDialog(false);
    console.log("Calling logout");
    logout();
  };

  const handleClickOutside = (e) => {
    const isInsideDialog = e.target.closest(".logout_dialog");

    const isProfileButton = e.target.closest(".logout_icon");

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

  return (
    <div className="hero">
      <header className="hero-header">
        <div className="menu-toggle" onClick={toggleMenu} id="menuToggle">
          &#9776;
        </div>
        <div className="logo">SDP</div>
        <nav
          className={`nav-links ${isMenuOpen ? "show" : ""}`}
          id="navLinks"
          ref={menuRef}
        >
          <a href="/">Home</a>

          {/* <a href="/services">Services</a> */}
          <a href="#" onClick={scrollToFooter}>
            Contact
          </a>
          <a href="/about">About Us</a>
        </nav>
        <div className="nav-end">
          <div className="quote-button-num"> + 0411 598 851</div>
          {!loggedIn && (
            <div className="login-register" onClick={() => navigate("/login")}>
              Login/Register
            </div>
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

          {/* logout Dialog  */}
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

      <div className="hero-content">
        <div className="header-img-container">
          <img
            src="https://thumbs.wbm.im/pw/small/e974318f69a98353476a7161b0b9e21e.png" // Your transparent image
            alt="Cleaner"
            className="header-img"
          />
        </div>
        <div className="text-content">
          <p className="subheading">YOUR HOME, OUR PRIORITY</p>
          <h1>Reliable and Professional Home Service Solutions</h1>
          <p className="description">
            Enjoy the ease of expert home services tailored to your needs. Count
            on us for dependable, high-quality results every time.
          </p>
          <button
            className="quote-button"
            onClick={() => navigate(loggedIn ? "/client" : "/login")}
          >
            Request Your Own Service
          </button>
        </div>
      </div>
      {/* Service provided  */}
      <section className="landing-services-section">
        <div className="landing-services-container">
          <p className="section-label">Our Services</p>
          <div className="landing-services-header">
            <h2 className="section-title">
              Here’s a look at the services we offer
            </h2>
            <p className="section-description">
              From everyday upkeep to major home improvements, we offer a
              diverse range of services to keep your home in excellent shape.
              Our experienced professionals are here to make your life
              easier—explore our offerings to find the right solution for your
              needs.
            </p>
          </div>

          <div className="landing-services-grid">
            <div className="landing-services-grid-1">
              <div className="landing-services-card-1">
                <h3 className="landing-services-title">
                  Home Renovation Services
                </h3>
                <p className="landing-services-desc">
                  Looking to update a single room or undertake a major
                  renovation, our skilled team will bring your vision to life
                  with quality craftsmanship.
                </p>
                <a href="/client#services" className="learn-more">
                  View more services ...
                </a>
              </div>
            </div>
            <div className="landing-services-grid-2">
              <div className="landing-services-card">
                <h3 className="landing-services-title">Electrical Services</h3>
                <p className="landing-services-desc">
                  Ensure your home is safe and efficient with our electrical
                  services, including repairs, installations, and upgrades.
                </p>
                <a href="/client#services" className="learn-more">
                  View more services ...
                </a>
              </div>

              <div className="landing-services-card">
                <h3 className="landing-services-title">Cleaning Services</h3>
                <p className="landing-services-desc">
                  From regular housekeeping to deep cleaning, we ensure your
                  home is spotless and hygienic.
                </p>
                <a href="/client#services" className="learn-more">
                  View more services ...
                </a>
              </div>

              <div className="landing-services-card">
                <h3 className="landing-services-title">
                  Landscaping And Lawn Care
                </h3>
                <p className="landing-services-desc">
                  From design to maintenance, we create beautiful, sustainable
                  gardens and lawns.
                </p>
                <a href="/client#services" className="learn-more">
                  View more services ...
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Service experience */}
      <section className="provided-container">
        <p className="section-label">Our Services</p>
        <div className="provided-content">
          <div className="provided-content-img">
            <div className="img-1">
              <img
                className=""
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGcKBSTCNBWZhXgHw6XIEzOgZ3gRSAcGUW9Q&s"
              />
            </div>
            <div className="img-2">
              <img
                className="provided-img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFJzUgpMauhsIH0sp9FvFPZawJ4PRfrImh2A&s"
              />
            </div>
            <div className="img-3">
              <img
                className=""
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsMBDhOJrHT6g-SBRDqVeX1KlLOHjxEcXUyw&s"
              />
            </div>
            <div className="img-4">
              <img
                className=""
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGcKBSTCNBWZhXgHw6XIEzOgZ3gRSAcGUW9Q&s"
              />
            </div>
          </div>
          <div className="provided-header">
            <h2 className="section-title">
              Here’s a look at the services we offer
            </h2>
            <p className="section-description">
              From everyday upkeep to major home improvements, we offer a
              diverse range of services to keep your home in excellent shape.
              Our experienced professionals are here to make your life
              easier—explore our offerings to find the right solution for your
              needs.
            </p>
            <p className="see-more">See more</p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="why-us-section">
        <div className="why-us-container">
          <div className="why-us-header">
            <p className="section-label">Why us</p>
            <h2 className="section-title">Why choose us?</h2>
            <p className="section-description">
              At our core, we are driven by a commitment to quality,
              reliability, and customer-first solutions. Our team blends
              innovation with deep industry knowledge to deliver services that
              are not only efficient but also tailored to your unique needs.
            </p>
          </div>
          <div className="why-us-content">
            <div className="content content-1">
              <div className="why-us-icon">
                <FontAwesomeIcon
                  icon={faArrowsSpin}
                  style={{ fontSize: 20, color: "#33d6ff" }}
                />
              </div>
              <h5>End-to-End Service Management</h5>
              <p>
                From scheduling to final delivery, we handle everything—no
                third-party contractors. You deal with us directly, ensuring
                full accountability and smoother communication.
              </p>
            </div>
            <div className="content content-2">
              <div className="why-us-icon">
                <FontAwesomeIcon
                  icon={faUserShield}
                  style={{ fontSize: 20, color: "#33d6ff" }}
                />
              </div>
              <h5>Trained & Insured Professionals</h5>
              <p>
                Our team members are background-checked, trained, and fully
                insured—giving you peace of mind and consistent, professional
                results every time.
              </p>
            </div>
            <div className="content content-3">
              <div className="why-us-icon">
                <FontAwesomeIcon
                  icon={faSliders}
                  style={{ fontSize: 20, color: "#33d6ff" }}
                />
              </div>
              <h5>Customizable Solutions for Every Need</h5>
              <p>
                Whether it’s a one-time job or ongoing support, we tailor
                services to fit your exact requirements, timelines, and budget.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonial */}
      <section className="review-section">
        <div className="review-container">
          <p className="section-label">Testimonial</p>
          <h2 className="section-title">What Our Clients Say</h2>
        </div>
        <div className="review-content">
          <div className="review-card">
            <div className="review-card-comment">
              <em>
                From start to finish, the service was seamless and incredibly
                professional. Every detail was handled with care, and the
                communication was top-notch. It's rare to find someone who
                genuinely cares about delivering quality—highly recommended!"
              </em>
              <div className="review-card-header"> - Tashi Wanmgo</div>
            </div>
            <div className="review-card-rating"></div>
          </div>
          <div className="review-card">
            <div className="review-card-comment">
              <em>
                "I couldn’t believe how easy and stress-free everything was.
              </em>
              <div className="review-card-header"> - Tashi Wanmgo</div>
            </div>
            <div className="review-card-rating"></div>
          </div>
          <div className="review-card">
            <div className="review-card-comment">
              <em>
                "After using your service, my productivity skyrocketed. What
                used to take me days now takes hours. The value far exceeds the
                cost. Truly game-changing!"
              </em>
              <div className="review-card-header"> - Tashi Wanmgo</div>
            </div>
            <div className="review-card-rating"></div>
          </div>
        </div>
      </section>

      <Footer ref={footerRef} />
    </div>
  );
}
