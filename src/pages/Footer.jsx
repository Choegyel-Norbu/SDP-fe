import React, { forwardRef } from "react";
import "../assets/css/Footer.css";

const Footer = forwardRef((props, ref) => {
  return (
    <div>
      <footer className="footer" ref={ref}>
        <div className="footer-container">
          <div className="footer-section brand">
            <h2>SDP</h2>
            <p>
              Streamlining your service needs. Fast, reliable, and tailored to
              your schedule.
            </p>
          </div>

          {/* <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div> */}

          {/* <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
            </ul>
          </div> */}

          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul>
              <li>📍 Perth, Australia</li>
              <li>📞 0411 598 851</li>
              <li>✉️ support@sdp.com</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; <span id="year"></span> SDP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
});

export default Footer;
