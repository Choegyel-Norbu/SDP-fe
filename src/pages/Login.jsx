import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import API_BASE_URL from "../config";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import "../assets/css/Custom.css";
import { useAuth } from "../services/AuthProvider";
import Footer from "./Footer";
import { Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthForm() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const registerFlag = location.flag;
  const [registerEmailStatus, setRegisterEmailStatus] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const googleLogin = async (googleAuthResponse) => {
    console.log("Google login response @@@ ", googleAuthResponse);
    const payload = {
      credential: googleAuthResponse.credential,
      clientId: googleAuthResponse.clientId,
      select_by: googleAuthResponse.select_by,
    };
    const res = await axios.post(`${API_BASE_URL}/auth/google`, payload);
    if (res.status === 200) {
      console.log("Success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
      login(
        res.data.token,
        res.data.userDTO.email,
        res.data.userDTO.id,
        res.data.userDTO.role
      );
    }
  };

  useEffect(() => {
    setRegisterEmailStatus(registerFlag);
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

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

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
      const endpoint = isRegister ? "auth/sendOtp" : "auth/login";
      const payload = { email: formData.email, password: formData.password };

      let res;

      if (isRegister) {
        res = await axios.post(
          `${API_BASE_URL}/${endpoint}?email=${formData.email}`
        );
      } else {
        res = await axios.post(`${API_BASE_URL}/${endpoint}`, payload);
      }
      console.log("Status - " + res.status);

      if (res.status === 201) {
        console.log("OTP Succcess");
        navigate("/otp", { state: formData });
      }

      if (res.status === 200) {
        console.log("Success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        login(
          res.data.token,
          res.data.userDTO.email,
          res.data.userDTO.id,
          res.data.userDTO.role
        );
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
        } else if (error.response.status === 409) {
          setApiError("The user already exits.");
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
    <>
      {showAlert && (
        <Alert variant="filled" severity="success">
          Here is a gentle confirmation that your action was successful.
        </Alert>
      )}

      <div className="login-container">
        <div className="form-section">
          <div className="login-form">
            <h2>{isRegister ? "Create Account" : "Login"}</h2>

            {apiError && <div className="alert alert-danger">{apiError}</div>}
            {isSubmitting && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginTop: "1rem",
                }}
              >
                <div className="custom-spinner" />
                <Alert severity="info">Registering please wait.......</Alert>
              </div>
            )}

            {registerEmailStatus && (
              <Alert severity="error">This is an error Alert.</Alert>
            )}

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
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              {/* Confirm Password Field with Toggle (only for register) */}
              {isRegister && (
                <div className="">
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
                      className="eye-btn"
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
              <div className="d-grid ">
                <button
                  type="submit"
                  className=" btn-primary btn-login"
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

              <GoogleOAuthProvider clientId="758224301470-h9ptb8u5m4vjinsm62acn2lqjjr04e2a.apps.googleusercontent.com">
                <div className="google-auth">
                  <GoogleLogin
                    onSuccess={(googleAuthResponse) =>
                      googleLogin(googleAuthResponse)
                    }
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </div>
              </GoogleOAuthProvider>

              <div className="text-center">
                <p className="mb-0">
                  {isRegister
                    ? "Already have an account? "
                    : "Don't have an account? "}
                  <span
                    style={{ color: "#0066ff", cursor: "pointer" }}
                    // className="btn btn-link p-0"
                    onClick={() => toggleRegister()}
                  >
                    {isRegister ? "Sign in" : "Register now"}
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
