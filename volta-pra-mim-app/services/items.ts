import { api } from "./api";

export type ApiItemStatus = "PERDIDO" | "ENCONTRADO" | "DEVOLVIDO";
export type ApiItemCategory =
  | "ELETRONICOS"
  | "MOCHILA"
  | "DOCUMENTOS"
  | "ACESSORIOS"
  | "OUTROS";

export type ApiItemUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
};

export type ApiItem = {
  id: string;
  title: string;
  description: string;
  category: ApiItemCategory;
  status: ApiItemStatus;
  location: string;
  date: string;
  imageUrl?: string | null;
  contactPhone?: string | null;
  hidePhone?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  user?: ApiItemUser;
};

export function formatItemDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatItemCategory(category: ApiItemCategory) {
  const categories: Record<ApiItemCategory, string> = {
    ELETRONICOS: "Eletrônicos",
    MOCHILA: "Mochila",
    DOCUMENTOS: "Documentos",
    ACESSORIOS: "Acessórios",
    OUTROS: "Outros",
  };

  return categories[category];
}

export type ListItemsParams = {
  status?: ApiItemStatus;
  category?: ApiItemCategory;
  search?: string;
  location?: string;
};

export async function listItems(params?: ListItemsParams) {
  const response = await api.get<ApiItem[]>("/items", { params });
  return response.data;
}

export async function getItemById(id: string) {
  const response = await api.get<ApiItem>(`/items/${id}`);
  return response.data;
}

export async function listMyItems() {
  const response = await api.get<ApiItem[]>("/items/my-items");
  return response.data;
}

export async function markItemAsReturned(id: string) {
  const response = await api.patch<ApiItem>(`/items/${id}/devolver`);
  return response.data;
}

export type UpdateItemPayload = {
  title?: string;
  description?: string;
  category?: ApiItemCategory;
  location?: string;
  date?: string;
  imageUrl?: string | null;
  contactPhone?: string | null;
  hidePhone?: boolean;
};

export async function updateItem(id: string, payload: UpdateItemPayload) {
  const response = await api.put<ApiItem>(`/items/${id}`, payload);
  return response.data;
}

export async function deleteItem(id: string) {
  await api.delete(`/items/${id}`);
}
