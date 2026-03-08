import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;

  if (!header) return reply.code(401).send({ message: "Token ausente" });

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return reply.code(401).send({ message: "Token inválido" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    (request as any).userId = payload.sub; // userId do token
  } catch {
    return reply.code(401).send({ message: "Token inválido" });
  }
}
