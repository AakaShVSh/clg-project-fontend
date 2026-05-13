// src/api/apiBase.jsx
import axios from "axios";

const API = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || "https://college-project-4t4q.onrender.com/api",
  withCredentials: true, // sends the httpOnly cookie on every request
});

// Just reject — ProtectedRoute handles the redirect via React Router.
API.interceptors.response.use(
  (response) => response,
  (error)    => Promise.reject(error)
);

export default API;