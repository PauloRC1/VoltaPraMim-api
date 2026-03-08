import { FastifyInstance } from "fastify";
import { register } from "../controllers/auth.controller";
import { login } from "../controllers/login.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
}
