import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import API_BASE_URL from "../config";

import "../assets/css/Custom.css";
import { toast } from "react-toastify";

export default function AuthForm() {
  // Toggle between login and register
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    // Confirm password validation (only for register)
    if (isRegister) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        valid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const endpoint = isRegister ? "api/registration" : "auth/login";
      const payload = isRegister
        ? formData
        : { email: formData.email, password: formData.password };

      const res = await axios.post(`${API_BASE_URL}/${endpoint}`, payload);

      if (isRegister && res.status === 201) {
        toast.success("Registration successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }

      if (res.status === 200) {
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userDTO.id);
        localStorage.setItem("userEmail", res.data.userDTO.email);
      }

      // Reset form after successful registration
      if (isRegister) {
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setApiError("User not found. Please check your email or register.");
        } else if (error.response.status === 401) {
          setApiError("Invalid credentials. Please check your password.");
        } else if (error.response.data && error.response.data.body) {
          setApiError(error.response.data.body);
        } else {
          setApiError("An unexpected error occurred. Please try again.");
        }
      } else if (error.request) {
        setApiError("Network error. Please check your connection.");
      } else {
        setApiError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="container-fluid login-container">
      <div className="row g-0">
        {/* Right Side - Hero Image */}
        <div className="col-lg-6 image-section">
          <div className="image-overlay">
            <div className="overlay-text">
              <h3 className="display-5 fw-bold mb-3">
                Simplify Household Services
              </h3>
              <p className="lead">
                Connect with trusted professionals for all your home needs
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-6 form-section">
          <div className="login-form">
            <h2 className="text-center mb-4">
              {isRegister ? "Create Account" : "Login"}
            </h2>

            {apiError && <div className="alert alert-danger">{apiError}</div>}

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Password Field with Toggle */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      isRegister ? "Create a password" : "Enter your password"
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
                {isRegister && (
                  <small className="text-muted">
                    Must be at least 8 characters
                  </small>
                )}
              </div>

              {/* Confirm Password Field with Toggle (only for register) */}
              {isRegister && (
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isRegister
                      ? "Registering..."
                      : "Logging in..."
                    : isRegister
                    ? "Register"
                    : "Login"}
                </button>
              </div>

              <div className="text-center">
                <p className="mb-0">
                  {isRegister
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => toggleRegister()}
                  >
                    {isRegister ? "Sign in" : "Register now"}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
