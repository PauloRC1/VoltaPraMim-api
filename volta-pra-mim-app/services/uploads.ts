import { api } from "./api";

export async function uploadImageIfNeeded(imageUrl: string) {
  if (!imageUrl.startsWith("data:image/")) {
    return imageUrl;
  }

  const response = await api.post<{ imageUrl: string }>("/uploads/images", {
    imageData: imageUrl,
  });

  return response.data.imageUrl;
}
