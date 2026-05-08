import { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { createInstitutionalAccountSchema } from "../schemas/auth.schema";

export async function adminSummary(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const [usersCount, openItemsCount, returnedItemsCount, lostCount, foundCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.item.count({ where: { status: { not: "DEVOLVIDO" } } }),
      prisma.item.count({ where: { status: "DEVOLVIDO" } }),
      prisma.item.count({ where: { status: "PERDIDO" } }),
      prisma.item.count({ where: { status: "ENCONTRADO" } }),
    ]);

  return reply.send({
    usersCount,
    openItemsCount,
    returnedItemsCount,
    lostCount,
    foundCount,
  });
}

export async function adminListUsers(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      ra: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: {
        select: { items: true },
      },
    },
  });

  return reply.send(users);
}

export async function adminListInstitutionalAccounts(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const accounts = await prisma.institutionalAccount.findMany({
    orderBy: { createdAt: "desc" },
  });

  return reply.send(accounts);
}

export async function adminCreateInstitutionalAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parsed = createInstitutionalAccountSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.status(400).send({
      message: parsed.error.issues[0]?.message || "Dados inválidos.",
    });
  }

  const account = await prisma.institutionalAccount
    .create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        ra: parsed.data.ra,
        phone: parsed.data.phone?.trim() || null,
      },
    })
    .catch((error) => {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return null;
      }

      throw error;
    });

  if (!account) {
    return reply.status(400).send({ message: "Email ou RA já cadastrado." });
  }

  return reply.status(201).send(account);
}

export async function adminListItems(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, ra: true },
      },
    },
  });

  return reply.send(items);
}

export async function adminMarkItemReturned(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };

  const item = await prisma.item.update({
    where: { id },
    data: { status: "DEVOLVIDO" },
  });

  return reply.send(item);
}

export async function adminDeleteItem(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };

  await prisma.item.delete({ where: { id } });

  return reply.send({ message: "Item excluído com sucesso" });
}
