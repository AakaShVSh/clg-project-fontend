// src/api/apiBase.jsx
import axios from "axios";

/**
 * All authentication is handled via httpOnly cookies set by the server.
 * The client never touches a token directly — no localStorage, no
 * Authorization header. Axios sends the cookie automatically on every
 * request because withCredentials: true is set below.
 */
const API = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || "https://college-project-4t4q.onrender.com/api",
  withCredentials: true, // ← sends the httpOnly cookie on every request
});

// ── Response interceptor ─────────────────────────────────────────────────────
// On 401, redirect to /login unless we're already on an auth page.
// No localStorage cleanup needed — the server clears the cookie on logout.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authPages = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-2fa"];
      const onAuthPage = authPages.some((p) => window.location.pathname.startsWith(p));
      if (!onAuthPage) {
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;