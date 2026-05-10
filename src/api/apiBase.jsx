import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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