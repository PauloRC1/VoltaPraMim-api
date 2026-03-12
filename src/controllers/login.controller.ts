import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { login, password } = request.body as {
    login: string;
    password: string;
  };

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: login }, { ra: login }],
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
    },
  });
}
