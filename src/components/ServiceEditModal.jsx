import React, { useEffect, useState } from "react";
import "../assets/css/Modal.css";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";

const ServiceEditModal = ({ service, onClose, onSave }) => {
  const [editedService, setEditedService] = useState({
    serviceRequestId: service.id,
    serviceType: service.serviceType || "",
    serviceName: service.serviceName || "",
    requestedDate: service.requestedDate,
    repeatFrequency: service.repeatFrequency || "",
    priority: service.priority || "",
    description: service.description || "",
  });

  useEffect(() => {
    if (service.requestedDate) {
      // Convert existing date to proper ISO format with timezone
      const dateObj = new Date(service.requestedDate);
      const isoString = dateObj.toISOString();
      setEditedService((prev) => ({
        ...prev,
        requestedDate: isoString,
      }));
    }
  }, [service.requestedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (service.requestedDate !== null) {
      const existDate = DateTime.fromJSDate(service.requestedDate);
      const utcDateISO = existDate.toUTC().toISO();
      setEditedService((prev) => ({
        ...prev,
        requestedDate: utcDateISO,
      }));
    }
    onSave(editedService);
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>Edit Service</h3>
          <button onClick={onClose} className="edit-close-btn">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="form-group">
            <label>Service Category</label>
            <select
              name="serviceType"
              value={editedService.serviceType}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select a service type:</option>
              <option value="General Cleaning">General Cleaning</option>
              <option value="Kitchen Services">Kitchen Services</option>
              <option value="Bathroom Services">Bathroom Services</option>
              <option value="Window & Glasses">Window & Glasses</option>
              <option value="Bedroom & Living Area">
                Bedroom & Living Area
              </option>
              <option value="Floor & Carpet">Floor & Carpet</option>
              <option value="Laundry Services">Laundry Services</option>
              <option value="Organization Help">Organization Help</option>
              <option value="Garden & Outdoor">Garden & Outdoor</option>
              <option value="Wall & Fixture">Wall & Fixture</option>
              <option value="Pet Related">Pet Related</option>
              <option value="Elderly or Disability Support Service">
                Elderly or Disability Support Service
              </option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          <div className="form-group">
            <label>Service Name</label>
            <input
              type="text"
              name="serviceName"
              value={editedService.serviceName}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Pick date and time</label>
              <DatePicker
                selected={
                  editedService.requestedDate
                    ? new Date(editedService.requestedDate)
                    : new Date()
                }
                onChange={(date) => {
                  const localDate = DateTime.fromJSDate(date);
                  const utcDateISO = localDate.toUTC().toISO();
                  setEditedService((prev) => ({
                    ...prev,
                    requestedDate: utcDateISO,
                  }));
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                placeholderText="Select date and time"
                className="date-picker-input"
              />
            </div>

            <div className="form-group">
              <label>Frequency</label>
              <select
                name="repeatFrequency"
                value={editedService.repeatFrequency}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select frequency</option>
                <option value="Daily">Daily</option>
                <option value="Fortnightly">Fortnightly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={editedService.priority}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              id="description"
              name="description"
              value={editedService.description}
              onChange={handleChange}
              rows="4"
              placeholder="Please describe the service you need in detail..."
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
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceEditModal;
