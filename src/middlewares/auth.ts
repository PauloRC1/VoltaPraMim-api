import "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await request.jwtVerify<{ sub: string }>();

    request.userId = user.sub;
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido" });
  }
}

export async function verifyAdmin(request: FastifyRequest, reply: FastifyReply) {
  await verifyJWT(request, reply);

  if (reply.sent) return;

  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send({ message: "Token inválido" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return reply.status(403).send({ message: "Acesso administrativo negado" });
  }
}
