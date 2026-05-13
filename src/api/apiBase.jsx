// // import axios from "axios";

// // const API = axios.create({
// //   baseURL: "https://college-project-4t4q.onrender.com/api",
// // });

// // API.interceptors.request.use((config) => {
// //   const token = localStorage.getItem("token");
// // console.log("in");

// //   if (token) {
// //     console.log("per");
    
// //     config.headers.Authorization = `Bearer ${token}`;
// //   }

// //   return config;
// // });

// // export default API;


// // src/api/apiBase.jsx
// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://college-project-4t4q.onrender.com/api",
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     // Use set() method which is guaranteed to work across axios versions
//     config.headers.set("Authorization", `Bearer ${token}`);
//   }
//   return config;
// }, (error) => Promise.reject(error));

// // Response interceptor: if 401, clear token so stale tokens don't linger
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Only clear if there actually was a token (avoid clearing on fresh visits)
//       const hadToken = !!localStorage.getItem("token");
//       if (hadToken) {
//         localStorage.removeItem("token");
//         // Reload to login only if not already on an auth page
//         const onAuthPage = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-2fa"].some(
//           (p) => window.location.pathname.startsWith(p)
//         );
//         if (!onAuthPage) window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;


// src/api/apiBase.jsx
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://college-project-4t4q.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
});

// Attach token on every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401 — clear token and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem("token");
      if (hadToken) {
        localStorage.removeItem("token");
        const onAuthPage = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-2fa"].some(
          (p) => window.location.pathname.startsWith(p)
        );
        if (!onAuthPage) window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;