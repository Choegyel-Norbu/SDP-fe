import React, { useEffect, useRef, useState } from "react";
import "../assets/css/AdminDashboard.css";
import Api from "../services/Api.jsx";
import { Alert } from "react-bootstrap";
import api from "../services/Api.jsx";

export default function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [countServices, setCountServices] = useState(0);
  const [showActionModal, setShowActionModal] = useState(null);
  const modalRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [client, setClient] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleMouseEnter = (serviceId) => {
    console.log("Entered hover ..........");
    timerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/client-address/service/${serviceId}`);
        setClient(res.data);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  useEffect(() => {
    console.log("User Effect triggered -------------------- ");
    const getService = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [servicesRes, countRes] = await Promise.all([
          Api.get("/getAllServices"),
          Api.get("/countServiceRequest"),
        ]);

        setServices(servicesRes.data);
        setCountServices(countRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getService();

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowActionModal(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refreshKey]);

  const handleActionClick = async (e, id) => {
    const status = e.target.getAttribute("data-action");
    console.log("ID:", id, "Status:", status);

    try {
      const res = await Api.put(
        `/updateStatus/${id}`,
        {},
        { params: { status } }
      );

      if (res.status === 200) {
        setRefreshKey((prev) => prev + 1);
        setShowActionModal(null);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  const toggleActionModal = (index) => {
    setShowActionModal(showActionModal === index ? null : index);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const handleSortChange = async (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
    setIsLoading(true);
    setError(null);

    try {
      const res = await Api.get(`/sortServices?option=${selectedOption}`);
      setServices(res.data);
    } catch (err) {
      console.error("Failed to sort services:", err);
      setError("Failed to apply sorting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side sorting fallback (optional)
  const sortServicesLocally = (services, option) => {
    return [...services].sort((a, b) => {
      switch (option) {
        case "date-asc":
          return new Date(a.requestedDate) - new Date(b.requestedDate);
        case "date-desc":
          return new Date(b.requestedDate) - new Date(a.requestedDate);
        case "priority-high":
          const priorityOrder = { High: 1, Medium: 2, Low: 3 };
          return (
            (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const displayedServices = sortOption
    ? sortServicesLocally(services, sortOption)
    : services;

  return (
    <div className="transactions-container">
      <div className="header-section">
        <h1>All Categories</h1>
        <div className="header-controls">
          <div className="filter-dropdown">
            <select
              className="filter-select"
              value={sortOption}
              onChange={handleSortChange}
              disabled={isLoading}
            >
              <option value="">Sort by</option>
              <option value="date-asc">Date: Oldest First</option>
              <option value="date-desc">Date: Newest First</option>
              <option value="priority-high">Priority: High to Low</option>
              <option value="status">Status</option>
            </select>
            <svg
              className="dropdown-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path fill="currentColor" d="M7 10l5 5 5-5z" />
            </svg>
          </div>
        </div>
      </div>
      <hr className="divider" />

      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <div className="loading-indicator">Loading...</div>}

      <div className="transactions-header">
        <h2>Services</h2>
      </div>

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedServices.length > 0 ? (
              displayedServices.map((service, index) => (
                <tr key={service.id || index}>
                  <td
                    className="category-cell"
                    onMouseEnter={() => handleMouseEnter(service.id)}
                  >
                    {service.serviceType}
                    <div className="hover-dialog ">
                      <h4>Client Details</h4>
                      <div className="client-details-content">
                        <p>
                          <strong>Name:</strong> {client?.firstName || "N/A"}{" "}
                          {client?.lastName || "NA"}
                        </p>
                        <p>
                          <strong>Email:</strong> {service.clientEmail || "N/A"}
                        </p>
                        <p>
                          <strong>Address:</strong> {client.unit || "N/A"}
                          {", "}
                          {client.streetAddress || "N/A"}
                          {", "}
                          {client.subarb || "N/A"}, {client.state || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{service.serviceName}</td>
                  <td>
                    {formatDateTime(service.requestedDate).date} <br />
                    <small>{formatDateTime(service.requestedDate).time}</small>
                  </td>
                  <td>{service.repeatFrequency}</td>
                  <td>
                    <span
                      className={`priority-badge ${service.priority.toLowerCase()}`}
                    >
                      {service.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${service.status.toLowerCase()}`}
                    >
                      {service.status}
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
                          <ul onClick={(e) => handleActionClick(e, service.id)}>
                            <li data-action="ASSIGNED">Assign</li>
                            <li data-action="COMPLETED">Completed</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  {isLoading ? "Loading..." : "No services found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        Showing 1 to {displayedServices.length} of {countServices} entries
      </div>
    </div>
  );
}
