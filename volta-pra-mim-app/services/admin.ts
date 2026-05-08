import { api } from "./api";
import { ApiItem } from "./items";

export type AdminSummary = {
  usersCount: number;
  openItemsCount: number;
  returnedItemsCount: number;
  lostCount: number;
  foundCount: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  ra: string;
  phone?: string | null;
  role?: "USER" | "ADMIN";
  createdAt: string;
  _count: {
    items: number;
  };
};

export type InstitutionalAccount = {
  id: string;
  name: string;
  email: string;
  ra: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
};

export type AdminItem = ApiItem & {
  user?: {
    id: string;
    name: string;
    email: string;
    ra: string;
  };
};

export function isAdminUser(user?: { role?: string } | null) {
  return user?.role === "ADMIN";
}

export async function getAdminSummary() {
  const response = await api.get<AdminSummary>("/admin/summary");
  return response.data;
}

export async function getAdminUsers() {
  const response = await api.get<AdminUser[]>("/admin/users");
  return response.data;
}

export async function getInstitutionalAccounts() {
  const response = await api.get<InstitutionalAccount[]>(
    "/admin/institutional-accounts",
  );
  return response.data;
}

export async function createInstitutionalAccount(payload: {
  name: string;
  email: string;
  ra: string;
  phone?: string | null;
}) {
  const response = await api.post<InstitutionalAccount>(
    "/admin/institutional-accounts",
    payload,
  );

  return response.data;
}

export async function getAdminItems() {
  const response = await api.get<AdminItem[]>("/admin/items");
  return response.data;
}

export async function markAdminItemReturned(id: string) {
  const response = await api.patch<AdminItem>(`/admin/items/${id}/returned`);
  return response.data;
}

export async function deleteAdminItem(id: string) {
  await api.delete(`/admin/items/${id}`);
}
