import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { uploadImageSchema } from "../schemas/upload.schema";

const uploadsDir = join(process.cwd(), "uploads", "items");

function parseImageData(imageData: string) {
  const match = /^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/.exec(
    imageData,
  );

  if (!match) return null;

  const mimeType = match[1];
  const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";

  return {
    extension,
    buffer: Buffer.from(match[2], "base64"),
  };
}

export async function uploadItemImage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = uploadImageSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Imagem inválida.",
    });
  }

  const image = parseImageData(parsed.data.imageData);

  if (!image) {
    return reply.status(400).send({ message: "Formato de imagem inválido." });
  }

  if (image.buffer.length > 5 * 1024 * 1024) {
    return reply.status(400).send({ message: "Imagem muito grande." });
  }

  await mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}.${image.extension}`;
  const filePath = join(uploadsDir, filename);

  await writeFile(filePath, image.buffer);

  const protocol = request.headers["x-forwarded-proto"] || request.protocol;
  const host = request.headers.host;
  const imageUrl = `${protocol}://${host}/uploads/items/${filename}`;

  return reply.status(201).send({ imageUrl });
}
