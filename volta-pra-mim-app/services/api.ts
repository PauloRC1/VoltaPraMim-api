import axios from "axios";
import { Platform } from "react-native";
import { getToken } from "./auth.storage";

const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3333" : "http://localhost:3333";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
