import React, { useEffect, useRef, useState } from "react";
import "../assets/css/landing.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";
import serviceCategories from "../data/ServiceCategories.json";
import api from "../services/Api";

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
          <a href="#">About Us</a>
          <a href="/services">Services</a>
          <a href="#" onClick={scrollToFooter}>
            Contact
          </a>
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
          <button className="quote-button" onClick={() => navigate("/client")}>
            Request Your Own Service
          </button>
        </div>
      </div>

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

              {/* <div className="landing-services-card-1">
                <h3 className="landing-services-title">Plumping Services</h3>
                <p className="landing-services-desc">
                  From fixing leaks and unclogging drains to installing new
                  fixtures, our expert plumbers handle it all with precision and
                  care.
                </p>
                <a href="/client#services" className="learn-more">
                  View more services ...
                </a>
              </div> */}
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

      <footer className="ft-container" ref={footerRef}>
        <div className="ft-content">
          <div className="ft-column">
            <h4 className="ft-title">Quick Links</h4>
            <ul className="ft-links">
              <li>
                <a href="/" className="ft-link">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" className="ft-link">
                  Services
                </a>
              </li>
              <li>
                <a href="/about" className="ft-link">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="ft-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="ft-column">
            <h4 className="ft-title">Contact Us</h4>
            <p className="ft-text"> 123 Main Street, City, Country</p>
            <p className="ft-text">📞 +123 456 7890</p>
            <p className="ft-text"> support@homeservices.com</p>
          </div>
        </div>

        <div className="ft-bottom">
          <p className="ft-bottom-text">
            © {new Date().getFullYear()} HomeServices. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
