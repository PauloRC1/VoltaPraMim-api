import { FastifyReply, FastifyRequest } from "fastify";
import "@fastify/jwt";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "../schemas/auth.schema";

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Dados de login inválidos.",
    });
  }

  const { login, password } = parsed.data;
  const normalizedLogin = login.toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedLogin }, { ra: login }],
    },
  });

  if (!user) {
    return reply.status(400).send({ message: "Credenciais inválidas." });
  }

  const doesPasswordMatch = await bcrypt.compare(password, user.password);

  if (!doesPasswordMatch) {
    return reply.status(400).send({ message: "Credenciais inválidas." });
  }

  const token = await reply.jwtSign(
    {
      sub: user.id,
    },
    {
      sign: {
        expiresIn: "7d",
      },
    },
  );

  return reply.status(200).send({
    message: "Login realizado com sucesso.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      ra: user.ra,
      phone: user.phone,
      role: user.role,
    },
  });
}

export async function adminLogin(request: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Dados de login inválidos.",
    });
  }

  const { login, password } = parsed.data;
  const normalizedLogin = login.toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedLogin }, { ra: login }],
    },
  });

  if (!user) {
    return reply.status(400).send({ message: "Credenciais inválidas." });
  }

  const doesPasswordMatch = await bcrypt.compare(password, user.password);

  if (!doesPasswordMatch) {
    return reply.status(400).send({ message: "Credenciais inválidas." });
  }

  if (user.role !== "ADMIN") {
    return reply.status(403).send({ message: "Acesso administrativo negado." });
  }

  const token = await reply.jwtSign(
    {
      sub: user.id,
    },
    {
      sign: {
        expiresIn: "7d",
      },
    },
  );

  return reply.status(200).send({
    message: "Login administrativo realizado com sucesso.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      ra: user.ra,
      phone: user.phone,
      role: user.role,
    },
  });
}
