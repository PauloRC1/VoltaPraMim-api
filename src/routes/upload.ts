import { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { uploadItemImage } from "../controllers/upload.controller";
import { verifyJWT } from "../middlewares/auth";

const uploadsDir = join(process.cwd(), "uploads", "items");

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/uploads/images", { preHandler: [verifyJWT] }, uploadItemImage);

  app.get("/uploads/items/:filename", async (request, reply) => {
    const { filename } = request.params as { filename: string };

    if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(filename)) {
      return reply.status(400).send({ message: "Arquivo inválido." });
    }

    const filePath = join(uploadsDir, filename);

    try {
      await access(filePath);
    } catch {
      return reply.status(404).send({ message: "Arquivo não encontrado." });
    }

    const contentType = filename.endsWith(".png")
      ? "image/png"
      : filename.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";

    return reply.type(contentType).send(createReadStream(filePath));
  });
}
