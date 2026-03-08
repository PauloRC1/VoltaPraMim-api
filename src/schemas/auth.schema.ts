import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "name é obrigatório"),
  email: z.string().email("email inválido"),
  password: z.string().min(6, "password deve ter no mínimo 6 caracteres"),
  ra_or_id: z.string().optional(),
  whatsapp: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("email inválido"),
  password: z.string().min(1, "password é obrigatório"),
});
