import "dotenv/config";
import Fastify from "fastify";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { authRoutes } from "./routes/auth";
import { itemRoutes } from "./routes/item";

const app = Fastify();
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET não configurado no arquivo .env.");
}

app.register(jwt, {
  secret: jwtSecret,
});

app.addHook("onRequest", async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  reply.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (request.method === "OPTIONS") {
    return reply.status(204).send();
  }
});

app.register(swagger, {
  openapi: {
    info: {
      title: "VoltaPraMim API",
      description: "API do sistema de Achados e Perdidos da universidade",
      version: "1.0.0",
    },
  },
});

app.register(swaggerUI, {
  routePrefix: "/docs",
});

app.register(authRoutes);
app.register(itemRoutes);

const port = Number(process.env.PORT ?? 3333);

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`Servidor rodando na porta ${port}!`);
});
