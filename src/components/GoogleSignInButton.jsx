import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../config/firebaseConfig";
import axios from "axios";
import { useState } from "react";
import API_BASE_URL from "../config";
import { useAuth } from "../services/AuthProvider";

const GoogleSignInButton = ({ onClose, onLoginSuccess }) => {
  const [message, setMessage] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(); // ✅ Get Firebase ID token

      const res = await axios.post(
        `${API_BASE_URL}/auth/login_google`,
        { idToken }, // ✅ Send as an object, not a string
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        console.log("Success");
        onLoginSuccess(
          res.data.token,
          res.data.userDTO.email,
          res.data.userDTO.id,
          res.data.userDTO.role
        );
        onClose();
      }
    } catch (error) {
      setMessage(`❌ Google Sign-In failed: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        gap: "0.5rem", // Tailwind gap-2 = 0.5rem
        color: "#333333",
        fontSize: "0.875rem", // text-sm = 14px
        fontWeight: 500, // font-medium
        paddingTop: "0.625rem", // py-2.5 = 10px
        paddingBottom: "0.625rem",
        paddingLeft: "1.25rem", // px-5 = 20px
        paddingRight: "1.25rem",
        borderRadius: "0.75rem", // rounded-xl = 12px
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // shadow-md
        border: "1px solid transparent",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        style={{ width: "1rem" }}
      />
      Continue with Google
    </button>
  );
};

export default GoogleSignInButton;
