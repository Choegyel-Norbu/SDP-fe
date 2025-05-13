import React, { useEffect, useState } from "react";
import "../assets/css/Modal.css";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";

const ServiceEditModal = ({ booking, onClose, onSave }) => {
  const [editedbooking, setEditedbooking] = useState({
    id: booking.id,
    startTime: booking.startTime,
    frequency: booking.frequency || "",
    specialInstructions: booking.specialInstructions || "",
  });

  useEffect(() => {
    console.log("Inside ServiceEdit time @@@ " + booking);
    if (booking.startTime) {
      // Convert existing date to proper ISO format with timezone
      const dateObj = new Date(booking.startTime);
      const isoString = dateObj.toISOString();
      setEditedbooking((prev) => ({
        ...prev,
        startTime: isoString,
      }));
    }
  }, [booking.startTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedbooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (booking.startTime !== null) {
      const existDate = DateTime.fromJSDate(booking.startTime);
      const utcDateISO = existDate.toUTC().toISO();
      setEditedbooking((prev) => ({
        ...prev,
        startTime: utcDateISO,
      }));
    }
    onSave(editedbooking);
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>Edit booking</h3>
          <button onClick={onClose} className="edit-close-btn">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="form-row">
            <div className="form-group">
              <label>Pick date and time</label>
              <DatePicker
                selected={
                  editedbooking.startTime
                    ? new Date(editedbooking.startTime)
                    : new Date()
                }
                onChange={(date) => {
                  const localDate = DateTime.fromJSDate(date);
                  const utcDateISO = localDate.toUTC().toISO();
                  setEditedbooking((prev) => ({
                    ...prev,
                    startTime: utcDateISO,
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
              <label>How often?</label>
              <select
                name="frequency"
                value={editedbooking.frequency}
                onChange={handleChange}
                className="form-control"
              >
                <option value="" style={{ color: "#fff" }}>
                  Select how often
                </option>
                <option value="Daily">Daily</option>
                <option value="Fortnightly">Fortnightly</option>
                <option value="Weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              id="description"
              name="specialInstructions"
              value={editedbooking.specialInstructions}
              onChange={handleChange}
              rows="4"
              placeholder="Please describe the booking you need in detail..."
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
