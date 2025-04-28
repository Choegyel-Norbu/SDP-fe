import React, { useState, useRef, useEffect } from "react";
import "../assets/css/Otp.css";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import axios from "axios";

const OTVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);
  const location = useLocation();
  const formData = location.state;
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setIsInvalid(false);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    if (pasteData.length === 6 && !isNaN(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    const email = formData?.email;

    if (enteredOtp.length === 6) {
      console.log("Verifying OTP:", enteredOtp);
      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/verifyOtp?email=${email}&otp=${enteredOtp}`
        );
        if (res.status === 200) {
          console.log("Otp verified.......");
          console.log("Registering............");
          try {
            const res = await axios.post(
              `${API_BASE_URL}/api/register`,
              formData
            );
            if (res.status === 201) {
              console.log("Register successfull...........");
              setIsVerified(true);
              setIsInvalid(false);
              setTimeout(() => {
                navigate("/login");
              }, 3000);
            }
          } catch (error) {
            if (error.status === 409) {
              console.log("Email is already registered");
              navigate("/login", { flag: true });
            }
          }
        }
      } catch (error) {
        if (error.status === 401) {
          setTimeout(() => {
            setIsVerified(false);
            setIsInvalid(true);
          }, 1000);
        }
      }
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setResendDisabled(true);
    setCountdown(30);
    setIsInvalid(false);
    console.log("Resending OTP... for email " + formData?.email);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/sendOtp?email=${formData?.email}`
      );
      if (res.status === 201) {
        console.log(res.data);
        setResendDisabled(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        {!isVerified ? (
          <>
            <div className="otp-header">
              <h2>Verify Your Email</h2>
              <p>We've sent a verification code to your email</p>
            </div>

            <form onSubmit={handleSubmit} className="otp-form">
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className={`otp-input ${isInvalid ? "invalid" : ""}`}
                    maxLength="1"
                    required
                  />
                ))}
              </div>

              {isInvalid && (
                <p className="error-message">Invalid code. Please try again.</p>
              )}

              <button type="submit" className="verify-button">
                Verify
              </button>
            </form>

            <div className="resend-section">
              <p>Didn't receive code?</p>
              <button
                onClick={handleResend}
                disabled={resendDisabled}
                className={`resend-button ${resendDisabled ? "disabled" : ""}`}
              >
                {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
              </button>
            </div>
          </>
        ) : (
          <div className="success-message">
            <svg viewBox="0 0 24 24" className="success-icon">
              <path
                fill="currentColor"
                d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
              />
            </svg>
            <h2>Verification Successful!</h2>
            <p>Your account has been verified successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTVerification;
