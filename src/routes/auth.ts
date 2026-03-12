import { FastifyInstance } from "fastify";
import { register, me } from "../controllers/auth.controller";
import { login } from "../controllers/login.controller";
import { verifyJWT } from "../middlewares/auth";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);

  app.get("/auth/me", { preHandler: [verifyJWT] }, me);
}
