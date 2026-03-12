import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "./storage";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthData = {
  token: string;
  user: User;
};

export async function saveAuthData({ token, user }: AuthData) {
  await AsyncStorage.multiSet([
    [STORAGE_KEY.token, token],
    [STORAGE_KEY.user, JSON.stringify(user)],
  ]);
}

export async function getToken() {
  return await AsyncStorage.getItem(STORAGE_KEY.token);
}

export async function getUser() {
  const user = await AsyncStorage.getItem(STORAGE_KEY.user);

  if (!user) return null;

  return JSON.parse(user);
}

export async function clearAuthData() {
  await AsyncStorage.multiRemove([STORAGE_KEY.token, STORAGE_KEY.user]);
}
