  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import axios from "axios";

  // Global Axios Configuration
  axios.defaults.defaults = axios.defaults.defaults || {}; // Ensure defaults exist
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  
  // Try to get CSRF token from meta tag if available
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
  }
  
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        console.error("Unauthorized! Token might be invalid.");
      }
      return Promise.reject(error);
    }
  );

  createRoot(document.getElementById("root")!).render(<App />);
  