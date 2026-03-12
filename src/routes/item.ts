import { FastifyInstance } from "fastify";
import {
  createItem,
  listItems,
  getItemById,
  markAsReturned,
  editItem,
  deleteItem,
  listMyItems,
} from "../controllers/item.controller";
import { verifyJWT } from "../middlewares/auth";

export async function itemRoutes(app: FastifyInstance) {
  app.get("/items", listItems);
  app.get("/items/my-items", { preHandler: [verifyJWT] }, listMyItems);
  app.get("/items/:id", getItemById);

  app.post("/items", { preHandler: [verifyJWT] }, createItem);
  app.patch("/items/:id/devolver", { preHandler: [verifyJWT] }, markAsReturned);
  app.put("/items/:id", { preHandler: [verifyJWT] }, editItem);
  app.delete("/items/:id", { preHandler: [verifyJWT] }, deleteItem);
}
