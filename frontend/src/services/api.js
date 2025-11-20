
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: false,
});

// Inserta automáticamente el token en cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // necesario para CORS preflight si usás custom headers
  config.headers["Content-Type"] = "application/json";
  return config;
}, (error) => Promise.reject(error));

export default API;
