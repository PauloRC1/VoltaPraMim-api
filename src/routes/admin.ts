import { FastifyInstance } from "fastify";
import {
  adminDeleteItem,
  adminCreateInstitutionalAccount,
  adminListInstitutionalAccounts,
  adminListItems,
  adminListUsers,
  adminMarkItemReturned,
  adminSummary,
} from "../controllers/admin.controller";
import { verifyAdmin } from "../middlewares/auth";

export async function adminRoutes(app: FastifyInstance) {
  app.get("/admin/summary", { preHandler: [verifyAdmin] }, adminSummary);
  app.get("/admin/users", { preHandler: [verifyAdmin] }, adminListUsers);
  app.get(
    "/admin/institutional-accounts",
    { preHandler: [verifyAdmin] },
    adminListInstitutionalAccounts,
  );
  app.post(
    "/admin/institutional-accounts",
    { preHandler: [verifyAdmin] },
    adminCreateInstitutionalAccount,
  );
  app.get("/admin/items", { preHandler: [verifyAdmin] }, adminListItems);
  app.patch(
    "/admin/items/:id/returned",
    { preHandler: [verifyAdmin] },
    adminMarkItemReturned,
  );
  app.delete("/admin/items/:id", { preHandler: [verifyAdmin] }, adminDeleteItem);
}
