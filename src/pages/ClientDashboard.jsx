import React, { useEffect, useRef, useState } from "react";
import "../assets/css/ClientDashboard.css";
import api from "../services/Api";
import { useAuth } from "../services/AuthProvider";
import Footer from "./Footer";
import ServiceEditModal from "../components/ServiceEditModal";
import { Alert } from "@mui/material";

export default function ClientDashboard({ onAlert }) {
  const { userId, email } = useAuth();
  const [client, setClient] = useState(null);
  const [services, setServices] = useState([]);
  const [showActionModal, setShowActionModal] = useState(null);
  const modalRef = useRef(null);
  const [editingService, setEditingService] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

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

    fetchClient();
    fetchClientServices();

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchClientServices = async () => {
    try {
      const res = await api.get(`/getServicesForClient/${userId}`);
      if (res.status === 200) setServices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowActionModal(null);
    }
  };

  const toggleActionModal = (index) => {
    setShowActionModal(showActionModal === index ? null : index);
  };

  const handleRemove = async (serviceId) => {
    try {
      console.log("Service id " + serviceId);
      const res = await api.delete(`/deleteServiceRequest/${serviceId}`);

      if (res.status === 200) {
        await fetchClientServices(); // refresh list after deletion
        console.log("Service deleted and list updated.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setShowActionModal(null); // close the modal regardless
    }
  };

  const formatDateTime = (isoString) => {
    if (isoString === null) return;
    const date = new Date(isoString);

    const datePart = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { date: datePart, time: timePart };
  };

  // Update your edit handler
  const handleEdit = (service) => {
    console.log("Services @@@- " + service);
    setEditingService(service);
    setShowActionModal(null);
  };

  return (
    <div>
      <div class="dashboard">
        {showAlert && (
          <Alert
            variant="filled"
            severity="success"
            style={{ position: "fixed" }}
          >
            Here is a gentle confirmation that your action was successful.
          </Alert>
        )}
        {client ? (
          <div class="dashboard-content">
            <div class="client-card">
              <div class="client-basic-info">
                <div class="avatar-placeholder"></div>
                <div class="client-name">
                  <h2 id="client-name">
                    {client.firstName} {client.lastName}
                  </h2>
                  <p style={{ fontSize: "14px" }}>Email: {email}</p>
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

              <div class="contact-info">
                <div class="info-item">
                  <span class="info-label">Address:</span>
                  <span class="info-value" id="phone-number">
                    {client.unit} {client.streetAddress}, {client.subarb},{" "}
                    {client.state}
                  </span>
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
                  <td>
                    {formatDateTime(service.requestedDate)?.date} <br />
                    <small>{formatDateTime(service.requestedDate)?.time}</small>
                  </td>
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
                            <li onClick={() => handleEdit(service)}>Edit</li>
                          </ul>
                          <ul>
                            <li onClick={() => handleRemove(service.id)}>
                              Remove
                            </li>
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

      {editingService && (
        <ServiceEditModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSave={async (updatedService) => {
            Object.entries(updatedService).forEach(([key, value]) => {
              console.log(`${key}: ${value}`);
            });
            try {
              const res = await api.put("/updateService", updatedService);
              if (res.status === 200) {
                console.log("Updating services.............");
                onAlert(true);
                await fetchClientServices();
              }
            } catch (error) {
              console.error(
                "Update error:",
                error.response?.data || error.message
              );
            }
            setEditingService(null);
          }}
        />
      )}
      <Footer />
    </div>
  );
}
