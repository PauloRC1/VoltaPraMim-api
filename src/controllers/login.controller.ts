import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../schemas/auth.schema";

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.code(400).send({
      message: "Dados inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return reply.code(401).send({ message: "Credenciais inválidas" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return reply.code(401).send({ message: "Credenciais inválidas" });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return reply.send({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      ra_or_id: user.ra_or_id,
      whatsapp: user.whatsapp,
      createdAt: user.createdAt,
    },
  });
}
