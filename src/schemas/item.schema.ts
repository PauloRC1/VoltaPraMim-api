import { z } from "zod";

export const createItemSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.enum([
    "ELETRONICOS",
    "MOCHILA",
    "DOCUMENTOS",
    "ACESSORIOS",
    "OUTROS",
  ]),
  location: z.string().min(1, "Localização é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  imageUrl: z.string().optional(),
});

export const editItemSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").optional(),
  description: z.string().min(1, "Descrição é obrigatória").optional(),
  location: z.string().min(1, "Localização é obrigatória").optional(),
  imageUrl: z.string().optional(),
});

export const listItemsQuerySchema = z.object({
  status: z.enum(["PERDIDO", "ENCONTRADO", "DEVOLVIDO"]).optional(),
  category: z
    .enum(["ELETRONICOS", "MOCHILA", "DOCUMENTOS", "ACESSORIOS", "OUTROS"])
    .optional(),

  search: z.string().optional(),
});
