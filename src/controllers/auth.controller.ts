import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { registerSchema } from "../schemas/auth.schema";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const parsed = registerSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.code(400).send({
      message: "Dados inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { name, email, password, ra_or_id, whatsapp } = parsed.data;

  const userAlreadyExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userAlreadyExists) {
    return reply.code(400).send({ message: "Email já cadastrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      ra_or_id,
      whatsapp,
    },
  });

  return reply.code(201).send({
    id: user.id,
    name: user.name,
    email: user.email,
    ra_or_id: user.ra_or_id,
    whatsapp: user.whatsapp,
    createdAt: user.createdAt,
  });
}
