import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("token"));
  });

  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [clientDetailSet, setclientDetailSet] = useState(false);

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

  const login = (token, email, userid, role) => {
    if (!token) return;
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userid);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    setLoggedIn(true);
    setEmail(email);
    setUserId(userid);
    setRole(role);
    navigate("/");

    detailsSet(userId);
  };

  const detailsSet = async (id) => {
    console.log("Inside login inside client set");
    const res = await api.get(`/clientSet/${id}`);
    if (res.data) setclientDetailSet(true);

    console.log(
      "Inside AuthContext and checking client detail set --- " + clientDetailSet
    );
  };

  const logout = () => {
    console.log("Loggin out .....");
    setLoggedIn(false);
    setEmail("");
    setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        login,
        logout,
        email,
        userId,
        role,
        clientDetailSet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
