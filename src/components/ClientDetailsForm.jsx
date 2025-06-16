import React, { useEffect, useState } from "react";
import "../assets/css/ClientDetailsForm.css";
import { useAuth } from "../services/AuthProvider";

const ClientDetailsForm = ({ onComplete }) => {
  const { userId, registerFlag } = useAuth();
  const [clientDetail, setClientDetail] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    addressDTO: {
      streetAddress: "",
      subarb: "",
      state: "",
      unit: "",
    },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("User register flag @@@ - " + registerFlag);
  }, []);

  const handleChangeDetail = (e) => {
    const { name, value } = e.target;
    setClientDetail({
      ...clientDetail,
      [name]: value,
    });
  };

  const handleChangeAddress = (e) => {
    const { name, value } = e.target;
    setClientDetail({
      ...clientDetail,
      addressDTO: {
        ...clientDetail.addressDTO,
        [name]: value,
      },
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal details validation
    if (!registerFlag) {
      if (!clientDetail.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!clientDetail.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
    }

    if (!clientDetail.phoneNumber || !clientDetail.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const trimmedPhone = clientDetail.phoneNumber.replace(/\D/g, ""); // removes non-digits

      if (trimmedPhone.length < 9) {
        newErrors.phoneNumber = "Phone number must be at least 9 digits";
      }
    }

    // Address validation
    if (!clientDetail.addressDTO.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
    }
    if (!clientDetail.addressDTO.subarb.trim()) {
      newErrors.subarb = "Suburb is required";
    }
    if (!clientDetail.addressDTO.state.trim()) {
      newErrors.state = "State is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    localStorage.setItem("clientDetailSet", "true");
    onComplete(clientDetail);
  };

  return (
    <div className="container my-5">
      {/* Added Bootstrap container and margin */}
      <div className="card p-4 shadow">
        {/* Bootstrap card for styling */}
        <div className="text-center mb-4">
          <h2 className="card-title">Provide Your Details</h2>
          <p className="card-subtitle text-muted">
            Kindly enter your information
          </p>
        </div>
        <form className="client-details-form">
          {!registerFlag && (
            <div className="row">
              {/* Bootstrap row for grid */}

              <div className="col-md-6 mb-3">
                {/* First Name - takes half width on medium screens and up */}
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.firstName ? "is-invalid" : ""
                  }`}
                  id="firstName"
                  name="firstName"
                  value={clientDetail.firstName}
                  onChange={handleChangeDetail}
                  placeholder="John"
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                {/* Last Name - takes half width on medium screens and up */}
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.lastName ? "is-invalid" : ""
                  }`}
                  id="lastName"
                  name="lastName"
                  value={clientDetail.lastName}
                  onChange={handleChangeDetail}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mb-3">
              {/* Phone Number */}
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.phoneNumber ? "is-invalid" : ""
                }`}
                id="phoneNumber"
                name="phoneNumber"
                value={clientDetail.phoneNumber}
                onChange={handleChangeDetail}
                placeholder="0412345678"
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback">{errors.phoneNumber}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              {/* Street Address */}
              <label htmlFor="streetAddress" className="form-label">
                Street Address
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.streetAddress ? "is-invalid" : ""
                }`}
                id="streetAddress"
                name="streetAddress"
                value={clientDetail.addressDTO.streetAddress}
                onChange={handleChangeAddress}
                placeholder="123 Main St"
              />
              {errors.streetAddress && (
                <div className="invalid-feedback">{errors.streetAddress}</div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              {/* Suburb */}
              <label htmlFor="suburb" className="form-label">
                Suburb
              </label>
              <input
                type="text"
                className={`form-control ${errors.subarb ? "is-invalid" : ""}`}
                id="suburb"
                name="subarb"
                value={clientDetail.addressDTO.subarb}
                onChange={handleChangeAddress}
                placeholder="Melbourne"
              />
              {errors.subarb && (
                <div className="invalid-feedback">{errors.subarb}</div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              {/* State */}
              <label htmlFor="state" className="form-label">
                State
              </label>
              <input
                type="text"
                className={`form-control ${errors.state ? "is-invalid" : ""}`}
                id="state"
                name="state"
                value={clientDetail.addressDTO.state}
                onChange={handleChangeAddress}
                placeholder="VIC"
              />
              {errors.state && (
                <div className="invalid-feedback">{errors.state}</div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              {/* Unit (Optional) */}
              <label htmlFor="unit" className="form-label">
                Unit (Optional)
              </label>
              <input
                type="text"
                className="form-control"
                id="unit"
                name="unit"
                value={clientDetail.addressDTO.unit}
                onChange={handleChangeAddress}
                placeholder="Unit 5"
              />
            </div>
          </div>

          <div className="d-grid gap-2 mt-4">
            {/* Bootstrap utility classes for button */}
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={validateForm}
            >
              Submit Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientDetailsForm;
