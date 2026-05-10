// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import API from "../api/apiBase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Helper: normalise whatever shape the API returns
  const normaliseUser = (data) => {
    // Backend may return { user: {...}, token: "..." } or just the user object
    return data?.user ?? data;
  };

  const login = async (data) => {
    if (data?.token) localStorage.setItem("token", data.token);

    const res = await API.get("/auth/me");
    const u   = normaliseUser(res.data);
    setUser(u);

    // Socket connect – only if socket is available
    try {
      const { default: socket } = await import("../socket");
      socket.connect();
      socket.emit("join", u._id);
    } catch (_) {}
  };

  const logout = async () => {
    try { await API.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("token");
    try {
      const { default: socket } = await import("../socket");
      socket.disconnect();
    } catch (_) {}
    setUser(null);
  };

  const logoutAll = async () => {
    try { await API.post("/auth/logout-all"); } catch (_) {}
    localStorage.removeItem("token");
    try {
      const { default: socket } = await import("../socket");
      socket.disconnect();
    } catch (_) {}
    setUser(null);
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await API.get("/auth/me");
        const u   = normaliseUser(res.data);
        setUser(u);
        try {
          const { default: socket } = await import("../socket");
          socket.connect();
          socket.emit("join", u._id);
        } catch (_) {}
      } catch {
        localStorage.removeItem("token");
      }
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, logoutAll }}>
      {children}
    </AuthContext.Provider>
  );
};