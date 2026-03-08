import { z } from "zod";

export const createItemSchema = z.object({
  title: z.string().min(1, "title é obrigatório"),
  description: z.string().min(1, "description é obrigatório"),
  category: z.enum([
    "ELETRONICOS",
    "MOCHILA",
    "DOCUMENTOS",
    "ACESSORIOS",
    "OUTROS",
  ]),
  location: z.string().min(1, "location é obrigatório"),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "date inválida",
  }),
  imageUrl: z.string().url("imageUrl inválida").optional().nullable(),
});

export const editItemSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  imageUrl: z.string().url("imageUrl inválida").optional().nullable(),
});

export const listItemsQuerySchema = z.object({
  status: z.enum(["ACHADO", "DEVOLVIDO"]).optional(),
  category: z
    .enum(["ELETRONICOS", "MOCHILA", "DOCUMENTOS", "ACESSORIOS", "OUTROS"])
    .optional(),
});
