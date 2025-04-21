import React, { useEffect, useRef, useState } from "react";
import "../assets/css/ClientDashboard.css";
import api from "../services/Api";
import { useAuth } from "../services/AuthProvider";
import Footer from "./Footer";

export default function ClientDashboard() {
  const { userId, email } = useAuth();
  const [client, setClient] = useState(null);
  const [services, setServices] = useState([]);
  const [showActionModal, setShowActionModal] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    console.log("Triggered useEffect @@@ ---------------");

    const fetchClient = async () => {
      try {
        const res = await api.get(`/getClientWithId/${userId}`);
        if (res.status === 200) setClient(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchClientServices = async () => {
      try {
        const res = await api.get(`/getServicesForClient/${userId}`);
        if (res.status === 200) setServices(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClient();
    fetchClientServices();

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowActionModal(null);
    }
  };

  const toggleActionModal = (index) => {
    setShowActionModal(showActionModal === index ? null : index);
  };

  const handleEdit = () => {
    console.log("Edit ");
    setShowActionModal(null);
  };

  return (
    <div>
      <div class="dashboard">
        {client ? (
          <div class="dashboard-content">
            <div class="client-card">
              <div class="client-basic-info">
                <div class="avatar-placeholder"></div>
                <div class="client-name">
                  <h2 id="client-name">
                    {client.firstName} {client.lastName}
                  </h2>
                  <p>Email: {email}</p>
                </div>
              </div>

              <div class="contact-info">
                <div class="info-item">
                  <span class="info-label">Phone:</span>
                  <span class="info-value" id="phone-number">
                    {client.phoneNumber}
                  </span>
                </div>
              </div>

              <div class="address-section">
                <h3>Address Details</h3>
                <div class="address-grid">
                  <div class="info-item">
                    <span class="info-label">Street:</span>
                    <span class="info-value" id="street-address">
                      {client.streetAddress}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Unit:</span>
                    <span class="info-value" id="unit">
                      {client.unit}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Suburb:</span>
                    <span class="info-value" id="suburb">
                      {client.subarb}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">State:</span>
                    <span class="info-value" id="state">
                      {client.state}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Post Code:</span>
                    <span class="info-value" id="post-code">
                      {client.unit}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Street Type:</span>
                    <span class="info-value" id="street-type">
                      {client.streetType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1>Undefined client</h1>
        )}
        <h2 className="table-title">Client service history</h2>

        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Service Name</th>
                <th>Requested Date</th>
                <th>Frequency</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index}>
                  <td>{service.serviceType}</td>
                  <td>{service.serviceName}</td>
                  <td>{service.requestedDate}</td>
                  <td>{service.repeatFrequency}</td>
                  <td>{service.priority}</td>
                  <td>
                    <span
                      className={`status-badge ${service.status.toLowerCase()}`}
                    >
                      [{service.status}]
                    </span>
                  </td>
                  <td>
                    <div className="action-container">
                      <span
                        className="action-icons"
                        onClick={() => toggleActionModal(index)}
                      >
                        &#8942;
                      </span>
                      {showActionModal === index && (
                        <div className="action_modal" ref={modalRef}>
                          <ul>
                            <li onClick={handleEdit}>Edit</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
