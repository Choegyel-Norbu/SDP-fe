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
  const [userName, setUserName] = useState("");
  const [registerFlag, setRegisterFlag] = useState(false);

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

  const login = (token, email, userid, role, userName, flag, detailSet) => {
    console.log("Reached inside login after login with google ......");
    if (!token) return;
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userid);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    setLoggedIn(true);
    setEmail(email);
    setUserId(userid);
    setUserName(userName);
    setRole(role);
    setRegisterFlag(flag);
    setclientDetailSet(detailSet);
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
        userName,
        registerFlag,
        clientDetailSet,
        setclientDetailSet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
