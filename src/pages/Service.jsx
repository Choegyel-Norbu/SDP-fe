import React, { useState } from "react";
import "../assets/css/Service.css";
import serviceCategories from "../data/ServiceCategories.json";

export default function Service() {
  const [service, setService] = useState(serviceCategories.serviceCategories);
  return (
    <div className="services-page">
      <header className="service-header">
        <h1>Our Services</h1>
        <p>Comprehensive solutions for every corner of your home</p>
      </header>

      <div className="services-container">
        {service.map((category, index) => (
          <div key={index} className="service-category">
            <div className="category-header">
              <h2>{category.category}</h2>
            </div>
            <ul className="service-list">
              {category.services.map((service, serviceIndex) => (
                <li key={serviceIndex} className="service-item">
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-name">{service.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
