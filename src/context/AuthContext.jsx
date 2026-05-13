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

import { createContext, useEffect, useRef, useState } from "react";
import API from "../api/apiBase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // true only while restoring existing session
  const [authLoading, setAuthLoading] = useState(true);

  // prevents double init in React StrictMode
  const initialized = useRef(false);

  const normaliseUser = (data) => data?.user ?? data;

  const connectSocket = async (userId) => {
    try {
      const { default: socket } = await import("../socket");

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join", userId);
    } catch (_) {}
  };

  const disconnectSocket = async () => {
    try {
      const { default: socket } = await import("../socket");
      socket.disconnect();
    } catch (_) {}
  };

  // LOGIN
  const login = async (responseData) => {
    try {
      // save token immediately
      if (responseData?.token) {
        localStorage.setItem("token", responseData.token);
      }

      let u = normaliseUser(responseData);

      // fallback only if user missing
      if (!u?._id && !u?.id) {
        const res = await API.get("/auth/me");
        u = normaliseUser(res.data);
      }

      setUser(u);

      await connectSocket(u._id || u.id);

      return u;
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      throw err;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (_) {}

    localStorage.removeItem("token");

    setUser(null);

    await disconnectSocket();
  };

  // LOGOUT ALL
  const logoutAll = async () => {
    try {
      await API.post("/auth/logout-all");
    } catch (_) {}

    localStorage.removeItem("token");

    setUser(null);

    await disconnectSocket();
  };

  // RESTORE SESSION
  useEffect(() => {
    // stop React strict mode duplicate execution
    if (initialized.current) return;

    initialized.current = true;

    const restoreSession = async () => {
      try {
        const token = localStorage.getItem("token");

        // no token
        if (!token) {
          setAuthLoading(false);
          return;
        }

        // validate token
        const res = await API.get("/auth/me");

        const u = normaliseUser(res.data);

        setUser(u);

        await connectSocket(u._id || u.id);
      } catch (err) {
        console.error("Session restore failed:", err);

        localStorage.removeItem("token");

        setUser(null);
      } finally {
        // VERY IMPORTANT
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        logoutAll,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};