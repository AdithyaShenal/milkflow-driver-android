import axios from "axios";
import { Preferences } from "@capacitor/preferences";
import router from "../routes/routes";

// export const api = axios.create({
//   baseURL: "http://localhost:4000/api",
//   withCredentials: true,
// });

export const api = axios.create({
  baseURL: "https://mclros-backend-2.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  async (config) => {
    const { value: token } = await Preferences.get({ key: "authToken" });
    if (token) {
      // Use the standard Bearer format
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Ensure this is returned
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 (unauthorized)
      await Preferences.remove({ key: "authToken" });

      // Optionally redirect to login
      router.navigate("/");
    }
    return Promise.reject(error);
  }
);
