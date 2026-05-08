import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import {
  createItemSchema,
  editItemSchema,
  listItemsQuerySchema,
} from "../schemas/item.schema";

export async function createItem(request: FastifyRequest, reply: FastifyReply) {
  const parsed = createItemSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.code(400).send({
      message: "Dados inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const body = parsed.data;
  const userId = request.userId;

  if (!userId) {
    return reply.code(401).send({ message: "Token inválido" });
  }

  const item = await prisma.item.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      status: body.status ?? "ENCONTRADO",
      location: body.location,
      date: new Date(body.date),
      imageUrl: body.imageUrl ?? null,
      contactPhone: body.contactPhone?.trim() || null,
      hidePhone: body.hidePhone ?? false,
      userId,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return reply.code(201).send(item);
}

export async function listItems(request: FastifyRequest, reply: FastifyReply) {
  const parsed = listItemsQuerySchema.safeParse(request.query);

  if (!parsed.success) {
    return reply.code(400).send({
      message: "Query inválida",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const query = parsed.data;

  const items = await prisma.item.findMany({
    where: {
      ...(query.status ? { status: query.status } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.location
        ? {
            location: {
              contains: query.location,
              mode: "insensitive",
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              {
                title: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
              {
                location: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return reply.send(items);
}

export async function getItemById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = request.params as { id: string };

  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!item) {
    return reply.code(404).send({ message: "Item não encontrado" });
  }

  return reply.send(item);
}

export async function markAsReturned(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const params = request.params as { id: string };
  const userId = request.userId;

  if (!userId) {
    return reply.code(401).send({ message: "Token inválido" });
  }

  const item = await prisma.item.findUnique({
    where: { id: params.id },
  });

  if (!item) {
    return reply.code(404).send({ message: "Item não encontrado" });
  }

  if (item.userId !== userId) {
    return reply.code(403).send({ message: "Você não pode alterar este item" });
  }

  if (item.status === "DEVOLVIDO") {
    return reply.code(400).send({ message: "Item já devolvido" });
  }

  const updated = await prisma.item.update({
    where: { id: params.id },
    data: { status: "DEVOLVIDO" },
  });

  return reply.send(updated);
}

export async function editItem(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { id: string };
  const userId = request.userId;

  if (!userId) {
    return reply.code(401).send({ message: "Token inválido" });
  }

  const parsed = editItemSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.code(400).send({
      message: "Dados inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const body = parsed.data;

  const item = await prisma.item.findUnique({
    where: { id: params.id },
  });

  if (!item) {
    return reply.code(404).send({ message: "Item não encontrado" });
  }

  if (item.userId !== userId) {
    return reply.code(403).send({ message: "Você não pode editar este item" });
  }

  if (item.status === "DEVOLVIDO") {
    return reply
      .code(400)
      .send({ message: "Item devolvido não pode ser editado" });
  }

  const updated = await prisma.item.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.description !== undefined
        ? { description: body.description }
        : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.location !== undefined ? { location: body.location } : {}),
      ...(body.date !== undefined ? { date: new Date(body.date) } : {}),
      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
      ...(body.contactPhone !== undefined
        ? { contactPhone: body.contactPhone?.trim() || null }
        : {}),
      ...(body.hidePhone !== undefined ? { hidePhone: body.hidePhone } : {}),
    },
  });

  return reply.send(updated);
}

export async function deleteItem(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as { id: string };
  const userId = request.userId;

  if (!userId) {
    return reply.code(401).send({ message: "Token inválido" });
  }

  const item = await prisma.item.findUnique({
    where: { id: params.id },
  });

  if (!item) {
    return reply.code(404).send({ message: "Item não encontrado" });
  }

  if (item.userId !== userId) {
    return reply.code(403).send({ message: "Você não pode excluir este item" });
  }

  await prisma.item.delete({
    where: { id: params.id },
  });

  return reply.code(200).send({ message: "Item excluído com sucesso" });
}

export async function listMyItems(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send({ message: "Token inválido" });
  }

  const items = await prisma.item.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reply.status(200).send(items);
}
