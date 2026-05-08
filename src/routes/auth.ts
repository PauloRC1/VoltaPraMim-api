import { FastifyInstance } from "fastify";
import {
  changePassword,
  deleteAccount,
  forgotPassword,
  lookupInstitutionalAccount,
  me,
  register,
  resetPassword,
  updateProfile,
} from "../controllers/auth.controller";
import { adminLogin, login } from "../controllers/login.controller";
import { verifyJWT } from "../middlewares/auth";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", register);
  app.post("/login", login);
  app.post("/admin/login", adminLogin);
  app.post("/auth/password/forgot", forgotPassword);
  app.post("/auth/password/reset", resetPassword);
  app.get("/institutional-accounts/:ra", lookupInstitutionalAccount);

  app.get("/auth/me", { preHandler: [verifyJWT] }, me);
  app.put("/auth/me", { preHandler: [verifyJWT] }, updateProfile);
  app.patch("/auth/password", { preHandler: [verifyJWT] }, changePassword);
  app.delete("/auth/me", { preHandler: [verifyJWT] }, deleteAccount);
}
