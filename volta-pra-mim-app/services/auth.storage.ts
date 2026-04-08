import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "./storage";

export type User = {
  id: string;
  name: string;
  email: string;
  ra?: string;
  phone?: string | null;
};

export type AccessMode = "authenticated" | "guest";

type AuthData = {
  token: string;
  user: User;
};

export async function saveAuthData({ token, user }: AuthData) {
  await AsyncStorage.multiSet([
    [STORAGE_KEY.token, token],
    [STORAGE_KEY.user, JSON.stringify(user)],
    [STORAGE_KEY.accessMode, "authenticated"],
  ]);
}

export async function saveGuestSession() {
  await AsyncStorage.multiSet([
    [STORAGE_KEY.accessMode, "guest"],
    [STORAGE_KEY.token, ""],
    [STORAGE_KEY.user, ""],
  ]);
}

export async function getToken() {
  const token = await AsyncStorage.getItem(STORAGE_KEY.token);
  return token || null;
}

export async function getUser() {
  const user = await AsyncStorage.getItem(STORAGE_KEY.user);

  if (!user) return null;

  return JSON.parse(user);
}

export async function getAccessMode(): Promise<AccessMode | null> {
  const accessMode = await AsyncStorage.getItem(STORAGE_KEY.accessMode);

  if (accessMode === "authenticated" || accessMode === "guest") {
    return accessMode;
  }

  return null;
}

export async function clearAuthData() {
  await AsyncStorage.multiRemove([
    STORAGE_KEY.token,
    STORAGE_KEY.user,
    STORAGE_KEY.accessMode,
  ]);
}
