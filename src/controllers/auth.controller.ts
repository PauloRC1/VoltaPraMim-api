import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { registerSchema } from "../schemas/auth.schema";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const parsed = registerSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Dados de cadastro inválidos.",
    });
  }

  const { name, email, ra, password, phone } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const normalizedPhone = phone?.trim() || undefined;

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

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      ra,
      password: passwordHash,
      phone: normalizedPhone,
    },
  });

  return reply.status(201).send({
    message: "Usuário cadastrado com sucesso.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      ra: user.ra,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const userId = (request as any).userId as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      ra: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return reply.status(404).send({ message: "Usuário não encontrado." });
  }

  return reply.status(200).send(user);
}
