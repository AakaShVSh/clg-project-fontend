// src/context/AuthContext.jsx
import { createContext, useEffect, useRef, useState } from "react";
import API from "../api/apiBase";

/**
 * Auth is entirely cookie-driven.
 * - The server sets/clears the httpOnly cookie.
 * - The client never reads or writes any token.
 * - Session restore works by hitting GET /auth/me — if the cookie is valid
 *   the server responds with the user; if not, it returns 401.
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true while restoring session
  const initialized                   = useRef(false);  // guard against StrictMode double-run

  // ── Socket helpers ──────────────────────────────────────────────────────────
  const connectSocket = async (userId) => {
    try {
      const { default: socket } = await import("../socket");
      if (!socket.connected) socket.connect();
      socket.emit("join", String(userId));
    } catch (_) {}
  };

  const disconnectSocket = async () => {
    try {
      const { default: socket } = await import("../socket");
      socket.disconnect();
    } catch (_) {}
  };

  // ── login ───────────────────────────────────────────────────────────────────
  // Call this after a successful POST /auth/login or /auth/register.
  // The server has already set the cookie; just store the user in state.
  const login = async (responseData) => {
    try {
      // The API response contains { user: {...} } — no token field needed.
      let u = responseData?.user ?? responseData;

      // If for some reason the user object is missing, re-fetch from /auth/me.
      // The cookie is already set by the server at this point.
      if (!u?._id && !u?.id) {
        const res = await API.get("/auth/me");
        u = res.data?.user ?? res.data;
      }

      setUser(u);
      await connectSocket(u._id || u.id);
      return u;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  // ── logout ──────────────────────────────────────────────────────────────────
  // POST /auth/logout tells the server to delete the session and clear the cookie.
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (_) {}
    setUser(null);
    await disconnectSocket();
  };

  // ── logoutAll ───────────────────────────────────────────────────────────────
  const logoutAll = async () => {
    try {
      await API.post("/auth/logout-all");
    } catch (_) {}
    setUser(null);
    await disconnectSocket();
  };

  // ── Restore session on page load ────────────────────────────────────────────
  // We simply call GET /auth/me. If the cookie is present and valid the server
  // returns the user; if not it returns 401 and the interceptor redirects.
  // We suppress the redirect here by catching the error ourselves.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const restoreSession = async () => {
      try {
        const res = await API.get("/auth/me");
        const u   = res.data?.user ?? res.data;
        setUser(u);
        await connectSocket(u._id || u.id);
      } catch {
        // 401 means no valid cookie — user is simply not logged in
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, logoutAll, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};