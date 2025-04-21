import React, { useEffect, useRef, useState } from "react";
import "../assets/css/AdminDashboard.css";
import Api from "../services/Api.jsx";
import { Alert } from "react-bootstrap";

export default function AdminDashboard() {
  // const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [countServices, setCountServices] = useState(0);
  const [showActionModal, setShowActionModal] = useState(null);
  const modalRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log("User Effect triggered -------------------- ");
    const getService = async () => {
      const res = await Api.get("/getAllServices");

      setServices(res.data);
      console.log(res.data.length);

      const response = await Api.get("/countServiceRequest");
      setCountServices(response.data);
    };

    getService();

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refreshKey]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowActionModal(null);
    }
  };

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
        setRefreshKey((prev) => prev + 1); // trigger useEffect
        setShowActionModal(null);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const toggleActionModal = (index) => {
    setShowActionModal(showActionModal === index ? null : index);
  };

  return (
    <div className="transactions-container">
      <div className="header-section">
        <h1>All Categories</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search Anything..." />
        </div>
      </div>

      <hr className="divider" />

      <div className="transactions-header">
        <h2>Services</h2>
        {/* <div className="actions">
          <button className="filter-btn">Filter</button>
          <button className="add-patient-btn">Add New Patient</button>
        </div> */}
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
                        <ul onClick={(e) => handleActionClick(e, service.id)}>
                          <li data-action="ASSIGNED">Assign</li>
                          <li data-action="COMPLETED">Completed</li>
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

      <div className="table-footer">
        Showing 1 to {services.length} of {countServices} entries
      </div>
    </div>
  );
}
