// // src/context/AuthContext.jsx
// import { createContext, useEffect, useState } from "react";
// import API from "../api/apiBase";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Helper: normalise whatever shape the API returns
//   const normaliseUser = (data) => {
//     // Backend may return { user: {...}, token: "..." } or just the user object
//     return data?.user ?? data;
//   };

//   const login = async (data) => {
//     if (data?.token) localStorage.setItem("token", data.token);

//     const res = await API.get("/auth/me");
//     const u   = normaliseUser(res.data);
//     setUser(u);

//     // Socket connect – only if socket is available
//     try {
//       const { default: socket } = await import("../socket");
//       socket.connect();
//       socket.emit("join", u._id);
//     } catch (_) {}
//   };

//   const logout = async () => {
//     try { await API.post("/auth/logout"); } catch (_) {}
//     localStorage.removeItem("token");
//     try {
//       const { default: socket } = await import("../socket");
//       socket.disconnect();
//     } catch (_) {}
//     setUser(null);
//   };

//   const logoutAll = async () => {
//     try { await API.post("/auth/logout-all"); } catch (_) {}
//     localStorage.removeItem("token");
//     try {
//       const { default: socket } = await import("../socket");
//       socket.disconnect();
//     } catch (_) {}
//     setUser(null);
//   };

//   useEffect(() => {
//     const init = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       try {
//         const res = await API.get("/auth/me");
//         const u   = normaliseUser(res.data);
//         setUser(u);
//         try {
//           const { default: socket } = await import("../socket");
//           socket.connect();
//           socket.emit("join", u._id);
//         } catch (_) {}
//       } catch {
//         localStorage.removeItem("token");
//       }
//     };
//     init();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, logoutAll }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import API from "../api/apiBase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* ── Normalise API response shape ──
     Backend may return:
       { token, user: {...} }   ← most common
       { token, ...userFields } ← flat
       { ...userFields }        ← /auth/me (no token field)
  */
  const normaliseUser = (data) => data?.user ?? data;

  const connectSocket = async (userId) => {
    try {
      const { default: socket } = await import("../socket");
      if (!socket.connected) socket.connect();
      socket.emit("join", userId);
    } catch (_) {}
  };

  const disconnectSocket = async () => {
    try {
      const { default: socket } = await import("../socket");
      socket.disconnect();
    } catch (_) {}
  };

  /* ── login ──
     Called with the full POST /auth/login response body.
     Saves the token FIRST, then extracts the user — no extra round-trip.
  */
  const login = async (responseData) => {
    if (responseData?.token) {
      localStorage.setItem("token", responseData.token);
    }

    let u = normaliseUser(responseData);

    // Only hit /auth/me if the login response didn't include user identity fields
    if (!u?._id && !u?.id) {
      const res = await API.get("/auth/me");
      u = normaliseUser(res.data);
    }

    setUser(u);
    await connectSocket(u._id || u.id);
  };

  const logout = async () => {
    try { await API.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("token");
    setUser(null);
    await disconnectSocket();
  };

  const logoutAll = async () => {
    try { await API.post("/auth/logout-all"); } catch (_) {}
    localStorage.removeItem("token");
    setUser(null);
    await disconnectSocket();
  };

  /* ── Boot: restore session ── */
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setAuthLoading(false); return; }
      try {
        const res = await API.get("/auth/me");
        const u   = normaliseUser(res.data);
        setUser(u);
        await connectSocket(u._id || u.id);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, logoutAll, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
