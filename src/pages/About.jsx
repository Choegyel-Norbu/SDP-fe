import React from "react";
import "../assets/css/About.css";

export default function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <div className="header-content">
          <h1>About Service Delivery Platform</h1>
          <p className="lead-text">
            Empowering communities through reliable, technology-driven service
            solutions
          </p>
        </div>
      </header>

      <main className="about-content">
        {/* <section className="about-section">
          <div className="section-header">
            <div className="section-number">01</div>
            <h2>Our Origin Story</h2>
          </div>
          <div className="section-body">
            <p>
              SDP was founded by a self-taught developer from rural Bhutan, born
              from a vision to bridge the gap between service providers and
              those needing assistance. What began as a personal challenge to
              solve local problems evolved into a robust platform built with
              React and Spring Boot through countless hours of dedicated
              learning and development.
            </p>
          </div>
        </section> */}

        <section className="about-section">
          <div className="section-header">
            <div className="section-number">01</div>
            <h2>Our Mission</h2>
          </div>
          <div className="section-body">
            <p>
              We exist to simplify service delivery through technology while
              maintaining the human connection. Our platform transforms how
              communities access essential services like laundry, car washing,
              and home maintenance by ensuring transparency, reliability, and
              seamless communication.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="section-header">
            <div className="section-number">02</div>
            <h2>Core Values</h2>
          </div>
          <div className="section-body">
            <div className="value-grid">
              <div className="value-card">
                <div className="value-icon">✓</div>
                <h3>Transparency</h3>
                <p>Clear workflows and open communication at every step</p>
              </div>
              <div className="value-card">
                <div className="value-icon">✓</div>
                <h3>Reliability</h3>
                <p>Consistent service quality you can depend on</p>
              </div>
              <div className="value-card">
                <div className="value-icon">✓</div>
                <h3>Community Focus</h3>
                <p>Built by locals, for local needs and challenges</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-header">
            <div className="section-number">03</div>
            <h2>Our Vision</h2>
          </div>
          <div className="section-body">
            <p className="vision-statement">
              SDP represents more than technology — it's a commitment to empower
              communities, create opportunities, and elevate service standards
              through innovation that understands real people and real needs.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
