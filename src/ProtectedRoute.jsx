// src/routes/ProtectedRoute.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import API from "./api/apiBase";

// ── User context ──────────────────────────────────────────────────────────────
// A minimal context so any component in the protected tree can read the
// authenticated user without prop-drilling. No token, no localStorage —
// just the user object fetched from GET /auth/me.
export const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

// ── ProtectedRoute ────────────────────────────────────────────────────────────
const ProtectedRoute = () => {
  const location = useLocation();
  const [status, setStatus] = useState("pending"); // "pending" | "ok" | "fail"
  const [user,   setUser]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await API.get("/auth/me");
        const u   = res.data?.user ?? res.data;
        if (!cancelled) { setUser(u); setStatus("ok"); }
      } catch {
        if (!cancelled) setStatus("fail");
      }
    };

    check();
    return () => { cancelled = true; };
  }, []);

  if (status === "pending") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <span>Loading…</span>
      </div>
    );
  }

  if (status === "fail") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <UserContext.Provider value={user}>
      <Outlet />
    </UserContext.Provider>
  );
};

export default ProtectedRoute;