import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("token"));
  });

  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || ""
  );

  useEffect(() => {
    // Optional: Add listener for storage changes to keep state in sync
    const handleStorageChange = () => {
      setLoggedIn(Boolean(localStorage.getItem("token")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (token, email, userid) => {
    if (!token) return;
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userid);
    localStorage.setItem("email", email);
    setLoggedIn(true);
    setEmail(email);
    setUserId(userid);
    navigate("/");
  };

  const logout = () => {
    console.log("Loggin out .....");
    setLoggedIn(false);
    setEmail("");
    setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, email, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
