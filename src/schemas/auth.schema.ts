import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório."),
  email: z.string().trim().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  ra: z.string().trim().min(1, "RA é obrigatório."),
  phone: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});
