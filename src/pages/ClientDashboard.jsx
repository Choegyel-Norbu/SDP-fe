import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Modal.css";
import "../assets/css/ClientDashboard.css";
import api from "../services/Api";
import { useAuth } from "../services/AuthProvider";
import Footer from "./Footer";
import { Alert, AlertTitle, Tooltip } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { DotLoader } from "react-spinners";

import ServiceEditModal from "../components/ServiceEditModal";

export default function ClientDashboard({ onAlert }) {
  const { userId, email, pictureURL, userName, registerFlag } = useAuth();
  const [client, setClient] = useState(null);
  const [booking, setBooking] = useState([]);
  const [showActionModal, setShowActionModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const modalRef = useRef(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const [clientRefresh, setClientRefresh] = useState(false);
  const [showDeleteService, setShowDeleteService] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClient();
    fetchClientBooking();

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("User name = " + userName);
    console.log("Register flag = " + registerFlag);
  });

  const fetchClient = async () => {
    try {
      const res = await api.get(`/getClientWithId/${userId}`);
      if (res.status === 200) {
        setClient(res.data);
        setIsLoading(false);
      }
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

  const fetchClientBooking = async () => {
    try {
      const res = await api.get(`/clientBookings/${userId}`);
      if (res.status === 200) setBooking(res.data);
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
  const handleEdit = (booking) => {
    console.log("booking booking@@@- " + booking);
    setShowActionModal(false);
    setEditingBooking(booking);
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
        await fetchClientBooking();
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
          <Alert
            severity="success"
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              width: "100%",
            }}
          >
            <AlertTitle>Success</AlertTitle>
            Your profile details were updated successfully. The latest changes
            have been saved.
          </Alert>
        )}
        {isLoading && (
          <div style={{ width: "90px", height: "90px", margin: "auto auto" }}>
            <DotLoader color="#000000" size={40} />
          </div>
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
                <img src={pictureURL} className="google-avatar" alt="Profile" />
                <div class="client-name">
                  {registerFlag ? (
                    <h2>{userName}</h2>
                  ) : (
                    <h2 id="client-name">
                      {client.firstName} {client.lastName}
                    </h2>
                  )}
                  <p style={{ fontSize: "14px" }}>Email: {email}</p>
                </div>
              </div>

              <div class="contact-info" id="contact-number">
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
                    className="edit-btn"
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
        <h2 className="table-title">Service history</h2>

        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Service Name</th>
                <th>Requested Date</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {booking.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.serviceType}</td>
                  <td>{booking.serviceName}</td>
                  <td>
                    {formatDateTime(booking.startTime)?.date} <br />
                    <small>{formatDateTime(booking.startTime)?.time}</small>
                  </td>
                  <td>{booking.frequency}</td>
                  <td>
                    <span
                      className={`status-badge ${booking.status.toLowerCase()}`}
                    >
                      [{booking.status}]
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
                            <li onClick={() => handleEdit(booking)}>Edit</li>
                          </ul>
                          <ul>
                            <li onClick={() => handleRemove(booking.id)}>
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
              {/* <div className="form-row"> */}
              {!registerFlag && (
                <>
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
                </>
              )}
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
              {/* </div> */}
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

      {editingBooking && (
        <ServiceEditModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={async (updatedBooking) => {
            try {
              const res = await api.put("/updateBooking", updatedBooking);

              if (res.status === 200) {
                await fetchClientBooking();
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
                setShowError(false);
                setEditingBooking(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
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
