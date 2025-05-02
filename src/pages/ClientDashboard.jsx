import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Modal.css";
import "../assets/css/ClientDashboard.css";
import api from "../services/Api";
import { useAuth } from "../services/AuthProvider";
import Footer from "./Footer";
import ServiceEditModal from "../components/ServiceEditModal";
import { Alert, AlertTitle, Tooltip } from "@mui/material";
import { FaEdit } from "react-icons/fa";

export default function ClientDashboard({ onAlert }) {
  const { userId, email } = useAuth();
  const [client, setClient] = useState(null);
  const [services, setServices] = useState([]);
  const [showActionModal, setShowActionModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const modalRef = useRef(null);
  const [editingService, setEditingService] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const [clientRefresh, setClientRefresh] = useState(false);
  const [showDeleteService, setShowDeleteService] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    fetchClient();
    fetchClientServices();

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchClient = async () => {
    try {
      const res = await api.get(`/getClientWithId/${userId}`);
      if (res.status === 200) setClient(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [updateClientDetail, setUpdateClientDetail] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    addressDTO: {
      streetAddress: "",
      state: "",
      unit: "",
      subarb: "",
    },
  });

  // Watch for 'client' changes
  useEffect(() => {
    if (client) {
      setUpdateClientDetail({
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        phoneNumber: client.phoneNumber || "",
        addressDTO: {
          streetAddress: client.streetAddress || "",
          state: client.state || "",
          unit: client.unit || "",
          subarb: client.subarb || "",
        },
      });
    }
  }, [client, clientRefresh]);

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
    setServiceToDelete(serviceId);
    setShowActionModal(false);
    setShowDeleteService(true);
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
    setShowActionModal(false);
    setEditingService(service);
    setShowActionModal(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("addressDTO.")) {
      const field = name.split(".")[1]; // Get the nested field, e.g., "state"
      setUpdateClientDetail((prev) => ({
        ...prev,
        addressDTO: {
          ...prev.addressDTO,
          [field]: value,
        },
      }));
    } else {
      setUpdateClientDetail((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onClose = () => {
    setShowEditModal(false);
    setClientRefresh(!clientRefresh);
  };

  const [isUpdating, setIsUpdating] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...updateClientDetail,
      userId: userId,
    };

    setIsUpdating(true);
    setShowError(false);
    try {
      const res = await api.put("/updateClient", payload);

      if (res.status === 200) {
        await fetchClient(); // Refresh client data
        setShowEditModal(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Update error:", error);

      setTimeout(() => setShowError(false), 6000);
    } finally {
      setIsUpdating(false); // Hide loading state
    }
  };

  const cancelDelete = () => {
    setShowDeleteService(false);
  };

  const confirmDelete = async () => {
    try {
      console.log("Service id " + serviceToDelete);
      const res = await api.delete(`/deleteServiceRequest/${serviceToDelete}`);

      if (res.status === 200) {
        await fetchClientServices();
        setShowDeleteService(false);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setShowActionModal(null);
    }
  };

  return (
    <div>
      <div class="dashboard">
        {showAlert && (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Here is a gentle confirmation that your action was successful.
          </Alert>
        )}

        {showError && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Oops, something went wrong. Please try again.
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
                  <Tooltip
                    title="Edit"
                    arrow
                    style={{ marginLeft: "1rem" }}
                    onClick={() => setShowEditModal(true)}
                  >
                    <FaEdit
                      className="text-xl text-blue-500"
                      size={20}
                      color="#00b8e6"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* client Edit modal */}
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

      {showEditModal && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3>Edit Detail</h3>
              <button onClick={onClose} className="edit-close-btn">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={updateClientDetail.firstName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={updateClientDetail.lastName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={updateClientDetail.phoneNumber}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="addressDTO.state"
                  value={updateClientDetail.addressDTO.state}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Subarb</label>
                <input
                  type="text"
                  name="addressDTO.subarb"
                  value={updateClientDetail.addressDTO.subarb}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  name="addressDTO.unit"
                  value={updateClientDetail.addressDTO.unit}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="addressDTO.streetAddress"
                  value={updateClientDetail.addressDTO.streetAddress}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteService && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="remove-dialog">
              <h4 className="">Confirm Deletion</h4>
              <p className="mb-6">
                Are you sure you want to delete <b></b>?
              </p>
              <div className="remove-dialog-action">
                <button onClick={cancelDelete} className="">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingService && (
        <ServiceEditModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSave={async (updatedService) => {
            console.log("Retrived date format " + updatedService.requestedDate);
            try {
              const res = await api.put("/updateService", updatedService);

              if (res.status === 200) {
                await fetchClientServices();
                onAlert(true);
                setEditingService(null);
              }
            } catch (error) {
              console.error("Full update error:", {
                request: error.config,
                response: error.response,
              });
              setShowError({
                severity: "error",
                message:
                  error.response?.data?.message || "Failed to update service",
              });
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
}
