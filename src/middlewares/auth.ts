import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();

    const user = request.user as { sub: string };

    (request as any).userId = user.sub;
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido" });
  }
}
