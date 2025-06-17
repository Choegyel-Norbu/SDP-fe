import React, { useRef, useState } from "react";
import useOutsideClick from "../hooks/useOutsideClick";
import GoogleSignInButton from "./GoogleSignInButton";
import axios from "axios"; // Make sure to install axios
import API_BASE_URL from "../config";
import { useAuth } from "../services/AuthProvider";

const LoginModal = ({ onClose }) => {
  const { login } = useAuth();
  const modalRef = useRef(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useOutsideClick(modalRef, onClose);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await axios.post(
        `${API_BASE_URL}/auth/sendOtp?email=${encodeURIComponent(email)}`
      );

      if (response.status === 201) {
        setStep("otp");
        setMessage(`OTP sent to ${email}`);
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!otp || otp.length !== 6) {
        throw new Error("Please enter a valid 6-digit OTP");
      }

      // Verify OTP with backend
      const res = await axios.post(
        `${API_BASE_URL}/auth/verifyOtp?email=${email}&otp=${otp}`
      );

      console.log("UserDTO @@@ - " + res.data.userDTO.email);
      if (res.status === 200) {
        setMessage("Login successful!");
        setTimeout(() => {
          onClose();
        }, 1000);
        login({
          token: res.data.token,
          email: res.data.userDTO.email,
          userid: res.data.userDTO.id,
          role: res.data.userDTO.role,
          userName: res.data.userDTO.name,
          pictureURL: res.data.userDTO.pictureURL,
          flag: res.data.userDTO.registerFlag,
          detailSet: res.data.userDTO.detailSet,
        });
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/sendOtp?email=${encodeURIComponent(email)}`
      );

      if (response.status === 201) {
        setStep("otp");
        setMessage(`OTP resent to ${email}`);
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 50,
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "32px",
          width: "100%",
          maxWidth: "28rem",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: "24px",
            lineHeight: "1",
            background: "none",
            border: "none",
            padding: 0,
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#000")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#6b7280")}
        >
          &times;
        </button>

        {/* Logo and Title */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#000",
              marginBottom: "16px",
            }}
          >
            SDP
          </h2>
          <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
            {step === "email"
              ? "We'll sign you in or create an account"
              : `Enter OTP sent to ${email}`}
          </p>
        </div>

        {/* Status messages */}
        {error && (
          <div
            style={{
              color: "#ef4444",
              backgroundColor: "#fee2e2",
              padding: "8px 12px",
              borderRadius: "4px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            style={{
              color: "#10b981",
              backgroundColor: "#d1fae5",
              padding: "8px 12px",
              borderRadius: "4px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        {/* Continue with Google */}
        <GoogleSignInButton onClose={onClose} onLoginSuccess={login} />

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "16px 0",
            color: "#9ca3af",
            fontSize: "14px",
          }}
        >
          <div style={{ flexGrow: 1, borderTop: "1px solid #e5e7eb" }}></div>
          <span style={{ margin: "0 8px" }}>OR</span>
          <div style={{ flexGrow: 1, borderTop: "1px solid #e5e7eb" }}></div>
        </div>

        {/* Email or OTP form based on step */}
        {step === "email" ? (
          <form onSubmit={handleEmailSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#60a5fa",
                color: "white",
                padding: "8px 0",
                borderRadius: "6px",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Continue with Email"}
            </button>
          </form>
        ) : (
          <form>
            <div style={{ marginBottom: "16px" }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit OTP"
                maxLength={6}
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  outline: "none",
                }}
                required
                disabled={loading}
              />
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  backgroundColor: "#60a5fa",
                  color: "white",
                  padding: "8px 0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
                onClick={handleOtpSubmit}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={resendOtp}
                style={{
                  backgroundColor: "transparent",
                  color: "#3b82f6",
                  padding: "8px 0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  border: "1px solid #d1d5db",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  opacity: loading ? 0.7 : 1,
                  paddingInline: "0.5rem",
                }}
                disabled={loading}
              >
                Resend
              </button>
            </div>
          </form>
        )}

        {/* Back button for OTP step */}
        {step === "otp" && (
          <button
            onClick={() => {
              setStep("email");
              setError("");
              setMessage("");
            }}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              color: "#6b7280",
              padding: "8px 0",
              borderRadius: "6px",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            ← Back to email entry
          </button>
        )}

        {/* Terms */}
        <p
          style={{
            fontSize: "12px",
            textAlign: "center",
            color: "#9ca3af",
            marginTop: "16px",
          }}
        >
          By signing up or signing in, you agree to our{" "}
          <a href="#" style={{ color: "#3b82f6", textDecoration: "underline" }}>
            Terms
          </a>{" "}
          and{" "}
          <a href="#" style={{ color: "#3b82f6", textDecoration: "underline" }}>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
