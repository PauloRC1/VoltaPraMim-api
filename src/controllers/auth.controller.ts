import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../schemas/auth.schema";

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;

  return `${user.slice(0, 3)}${"*".repeat(Math.max(user.length - 3, 2))}@${domain}`;
}

function maskPhone(phone: string) {
  return phone.replace(/\d(?=\D*\d{2})/g, "*");
}

function publicUser(user: {
  id: string;
  name: string;
  email: string;
  ra: string;
  phone: string | null;
  role?: "USER" | "ADMIN";
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    ra: user.ra,
    phone: user.phone,
    ...(user.role ? { role: user.role } : {}),
    ...(user.createdAt ? { createdAt: user.createdAt } : {}),
    ...(user.updatedAt ? { updatedAt: user.updatedAt } : {}),
  };
}

function generateResetCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizeLogin(login: string) {
  return login.trim().toLowerCase();
}

async function findUserByLogin(login: string) {
  const normalizedLogin = normalizeLogin(login);

  return prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedLogin }, { ra: login.trim() }],
    },
  });
}

export async function lookupInstitutionalAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { ra } = request.params as { ra: string };
  const account = await prisma.institutionalAccount.findUnique({
    where: { ra: ra.trim() },
  });

  if (!account || !account.isActive) {
    return reply.status(404).send({
      message: "Conta institucional não encontrada.",
    });
  }

  return reply.status(200).send({
    ra: account.ra,
    name: account.name,
    email: maskEmail(account.email),
    phone: account.phone ? maskPhone(account.phone) : "",
  });
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const parsed = registerSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Dados de cadastro inválidos.",
    });
  }

  const { ra, password } = parsed.data;
  const institutionalAccount = await prisma.institutionalAccount.findUnique({
    where: { ra },
  });

  if (!institutionalAccount || !institutionalAccount.isActive) {
    return reply.status(404).send({
      message: "RA não encontrado na base institucional.",
    });
  }

  const normalizedEmail = institutionalAccount.email.toLowerCase();
  const normalizedPhone = institutionalAccount.phone?.trim() || null;

  const userWithSameEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (userWithSameEmail) {
    return reply.status(400).send({ message: "Email já cadastrado." });
  }

  const userWithSameRa = await prisma.user.findUnique({
    where: { ra },
  });

  if (userWithSameRa) {
    return reply.status(400).send({ message: "RA já cadastrado." });
  }

  const passwordHash = await bcrypt.hash(password, 8);

  const user = await prisma.user
    .create({
      data: {
        name: institutionalAccount.name,
        email: normalizedEmail,
        ra,
        password: passwordHash,
        phone: normalizedPhone,
      },
    })
    .catch((error) => {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return null;
      }

      throw error;
    });

  if (!user) {
    return reply.status(400).send({ message: "Email ou RA já cadastrado." });
  }

  return reply.status(201).send({
    message: "Usuário cadastrado com sucesso.",
    user: publicUser(user),
  });
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send({ message: "Token inválido." });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      ra: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return reply.status(404).send({ message: "Usuário não encontrado." });
  }

  return reply.status(200).send(user);
}

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send({ message: "Token inválido." });
  }

  const parsed = updateProfileSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Dados inválidos.",
    });
  }

  const body = parsed.data;
  const normalizedEmail = body.email?.toLowerCase();

  const user = await prisma.user
    .update({
      where: { id: userId },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(normalizedEmail !== undefined ? { email: normalizedEmail } : {}),
        ...(body.phone !== undefined
          ? { phone: body.phone?.trim() || null }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        ra: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    .catch((error) => {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return null;
      }

      throw error;
    });

  if (!user) {
    return reply.status(400).send({ message: "Email já cadastrado." });
  }

  return reply.status(200).send(user);
}

export async function changePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send({ message: "Token inválido." });
  }

  const parsed = changePasswordSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Dados inválidos.",
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return reply.status(404).send({ message: "Usuário não encontrado." });
  }

  const passwordMatches = await bcrypt.compare(
    parsed.data.currentPassword,
    user.password,
  );

  if (!passwordMatches) {
    return reply.status(400).send({ message: "Senha atual inválida." });
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 8);

  await prisma.user.update({
    where: { id: userId },
    data: { password: passwordHash },
  });

  return reply.status(200).send({ message: "Senha alterada com sucesso." });
}

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = forgotPasswordSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Dados inválidos.",
    });
  }

  const user = await findUserByLogin(parsed.data.login);

  if (!user) {
    return reply.status(404).send({ message: "Usuário não encontrado." });
  }

  const code = generateResetCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      code,
      expiresAt,
      userId: user.id,
    },
  });

  return reply.status(200).send({
    message: "Código de recuperação gerado.",
    code,
    expiresAt,
  });
}

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = resetPasswordSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Dados inválidos.",
    });
  }

  const user = await findUserByLogin(parsed.data.login);

  if (!user) {
    return reply.status(404).send({ message: "Usuário não encontrado." });
  }

  const token = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      code: parsed.data.code,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!token) {
    return reply.status(400).send({ message: "Código inválido ou expirado." });
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 8);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return reply.status(200).send({ message: "Senha redefinida com sucesso." });
}

export async function deleteAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send({ message: "Token inválido." });
  }

  await prisma.user.delete({ where: { id: userId } });

  return reply.status(200).send({ message: "Conta excluída com sucesso." });
}
