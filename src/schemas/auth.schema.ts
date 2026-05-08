import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório.").optional(),
  email: z.string().trim().email("Email inválido.").optional(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  ra: z.string().trim().min(1, "RA é obrigatório."),
  phone: z.string().trim().optional(),
});

export const loginSchema = z.object({
  login: z.string().trim().min(1, "Email ou RA é obrigatório."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório.").optional(),
  email: z.string().trim().email("Email inválido.").optional(),
  phone: z.string().trim().nullable().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória."),
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres."),
});

export const forgotPasswordSchema = z.object({
  login: z.string().trim().min(1, "Email ou RA é obrigatório."),
});

export const resetPasswordSchema = z.object({
  login: z.string().trim().min(1, "Email ou RA é obrigatório."),
  code: z.string().trim().length(6, "Código inválido."),
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres."),
});

export const createInstitutionalAccountSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório."),
  email: z.string().trim().email("Email inválido."),
  ra: z.string().trim().min(1, "RA é obrigatório."),
  phone: z.string().trim().nullable().optional(),
});
