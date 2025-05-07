import React, { forwardRef } from "react";
import "../assets/css/Footer.css";

const Footer = forwardRef((props, ref) => {
  return (
    <div>
      <footer className="ft-container" ref={ref}>
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
});

export default Footer;
