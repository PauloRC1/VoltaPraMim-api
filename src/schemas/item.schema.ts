import { z } from "zod";

const categorySchema = z.enum([
  "ELETRONICOS",
  "MOCHILA",
  "DOCUMENTOS",
  "ACESSORIOS",
  "OUTROS",
]);

const validDateString = z.string().min(1, "Data é obrigatória").refine(
  (value) => !Number.isNaN(Date.parse(value)),
  "Data inválida",
);

export const createItemSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: categorySchema,
  status: z.enum(["PERDIDO", "ENCONTRADO"]).optional(),
  location: z.string().min(1, "Localização é obrigatória"),
  date: validDateString,
  imageUrl: z.string().optional(),
  contactPhone: z.string().trim().optional(),
  hidePhone: z.boolean().optional(),
});

export const editItemSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").optional(),
  description: z.string().min(1, "Descrição é obrigatória").optional(),
  category: categorySchema.optional(),
  location: z.string().min(1, "Localização é obrigatória").optional(),
  date: validDateString.optional(),
  imageUrl: z.string().nullable().optional(),
  contactPhone: z.string().trim().nullable().optional(),
  hidePhone: z.boolean().optional(),
});

export const listItemsQuerySchema = z.object({
  status: z.enum(["PERDIDO", "ENCONTRADO", "DEVOLVIDO"]).optional(),
  category: categorySchema.optional(),
  search: z.string().optional(),
  location: z.string().optional(),
});
