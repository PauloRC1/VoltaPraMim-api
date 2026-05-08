import "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await request.jwtVerify<{ sub: string }>();

    request.userId = user.sub;
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido" });
  }
}
