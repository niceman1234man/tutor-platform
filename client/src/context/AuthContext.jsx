import React, { createContext, useState, useEffect, useRef } from "react";

export const AuthContext = createContext();

function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // convert to ms
  } catch {
    return null;
  }
}

function loadStoredUser() {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const user = JSON.parse(stored);
    const token = user?.token;
    if (!token) return null;
    const expiry = getTokenExpiry(token);
    if (expiry && Date.now() >= expiry) {
      localStorage.removeItem("user");
      return null;
    }
    return user;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);
  const logoutTimer = useRef(null);

  function scheduleAutoLogout(token) {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    const expiry = getTokenExpiry(token);
    if (!expiry) return;
    const delay = expiry - Date.now();
    if (delay <= 0) {
      logout();
      return;
    }
    logoutTimer.current = setTimeout(() => {
      logout();
    }, delay);
  }

  useEffect(() => {
    if (user?.token) {
      localStorage.setItem("user", JSON.stringify(user));
      scheduleAutoLogout(user.token);
    } else {
      localStorage.removeItem("user");
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    }
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
