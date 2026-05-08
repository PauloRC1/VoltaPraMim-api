import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { getToken } from "./auth.storage";

function getExpoHostUrl() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (!hostUri) return null;

  const host = hostUri.split(":")[0];

  return `http://${host}:3333`;
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  getExpoHostUrl() ||
  (Platform.OS === "android" ? "http://10.0.2.2:3333" : "http://localhost:3333");

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
