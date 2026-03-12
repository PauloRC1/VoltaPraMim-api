import Fastify from "fastify";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { authRoutes } from "./routes/auth";
import { itemRoutes } from "./routes/item";

const app = Fastify();

app.register(jwt, {
  secret: "segredo",
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

app.listen({ port: 3333 }).then(() => {
  console.log("Servidor rodando!");
});
