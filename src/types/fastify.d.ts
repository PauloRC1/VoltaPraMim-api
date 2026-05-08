import "@fastify/jwt";
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}
