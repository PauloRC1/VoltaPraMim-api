import { api } from "./api";
import { clearAuthData, saveAuthData, updateStoredUser, User } from "./auth.storage";

export async function lookupInstitutionalAccount(ra: string) {
  const response = await api.get<{
    ra: string;
    name: string;
    email: string;
    phone: string;
  }>(`/institutional-accounts/${ra}`);

  return response.data;
}

export async function adminLogin(payload: { login: string; password: string }) {
  const response = await api.post<{ token: string; user: User }>("/admin/login", payload);
  await saveAuthData(response.data);
  return response.data;
}

export async function refreshStoredUser() {
  const response = await api.get<User>("/auth/me");
  await updateStoredUser(response.data);
  return response.data;
}

export async function updateProfile(payload: {
  name: string;
  email: string;
  phone?: string | null;
}) {
  const response = await api.put<User>("/auth/me", payload);
  await updateStoredUser(response.data);
  return response.data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  await api.patch("/auth/password", payload);
}

export async function requestPasswordReset(login: string) {
  const response = await api.post<{
    message: string;
    code: string;
    expiresAt: string;
  }>("/auth/password/forgot", { login });

  return response.data;
}

export async function resetPassword(payload: {
  login: string;
  code: string;
  newPassword: string;
}) {
  await api.post("/auth/password/reset", payload);
}

export async function deleteAccount() {
  await api.delete("/auth/me");
  await clearAuthData();
}
