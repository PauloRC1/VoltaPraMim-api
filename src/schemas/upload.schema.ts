import { z } from "zod";

export const uploadImageSchema = z.object({
  imageData: z.string().min(1, "Imagem é obrigatória."),
});
