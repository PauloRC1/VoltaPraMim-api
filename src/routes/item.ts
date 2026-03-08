import { FastifyInstance } from "fastify";
import { auth } from "../middlewares/auth";
import {
  createItem,
  listItems,
  getItemById,
  markAsReturned,
  editItem,
} from "../controllers/item.controller";

export async function itemRoutes(app: FastifyInstance) {
  app.get("/items", listItems);
  app.get("/items/:id", getItemById);

  app.post("/items", { preHandler: auth }, createItem);
  app.patch("/items/:id", { preHandler: auth }, editItem);
  app.patch("/items/:id/devolver", { preHandler: auth }, markAsReturned);
}
