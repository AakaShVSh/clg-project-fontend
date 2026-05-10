import axios from "axios";

const API = axios.create({
  baseURL: "https://college-project-4t4q.onrender.com",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
console.log("in");

  if (token) {
    console.log("per");
    
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;