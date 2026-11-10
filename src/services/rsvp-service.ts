import { Prisma } from "@prisma/client";
import { getPrismaClient } from "@/lib/prisma";
import type { ValidatedRsvpInput } from "@/lib/validations/rsvp";

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "A base de dados PostgreSQL ainda não está configurada neste ambiente. Configure a variável DATABASE_URL (ex.: Neon PostgreSQL) para activar o registo de confirmações."
    );
    this.name = "DatabaseNotConfiguredError";
  }
}

export class DuplicateRsvpError extends Error {
  constructor() {
    super(
      "Já existe uma confirmação de presença registada com este número de telefone/WhatsApp. Caso precises de alterar os teus dados, por favor contacta directamente os noivos."
    );
    this.name = "DuplicateRsvpError";
  }
}

export async function createRsvpConfirmation(
  input: ValidatedRsvpInput,
  idempotencyKey?: string | null
) {
  const prisma = getPrismaClient();
  if (!prisma) {
    throw new DatabaseNotConfiguredError();
  }

  const sanitizedKey =
    idempotencyKey && idempotencyKey.trim().length <= 64
      ? idempotencyKey.trim()
      : null;

  // Se a mesma chave de idempotência já foi gravada (ex.: duplo clique em rede lenta), devolve o registo existente
  if (sanitizedKey) {
    const existingByKey = await prisma.rsvp.findUnique({
      where: { idempotencyKey: sanitizedKey },
    });
    if (existingByKey) {
      return existingByKey;
    }
  }

  // Verifica se já existe resposta com o mesmo número normalizado
  const existingByPhone = await prisma.rsvp.findUnique({
    where: { normalizedPhone: input.normalizedPhone },
  });

  if (existingByPhone) {
    throw new DuplicateRsvpError();
  }

  // Constrói os registos individuais da tabela Guest quando o convidado confirma presença
  const guestsToCreate = input.attending
    ? [
        {
          fullName: input.fullName,
          isPrimary: true,
        },
        ...input.companionNames.map((companionName) => ({
          fullName: companionName,
          isPrimary: false,
        })),
      ]
    : [];

  try {
    const created = await prisma.rsvp.create({
      data: {
        fullName: input.fullName,
        phone: input.phone,
        normalizedPhone: input.normalizedPhone,
        attending: input.attending,
        companionsCount: input.companionsCount,
        message: input.message,
        idempotencyKey: sanitizedKey,
        guests:
          guestsToCreate.length > 0
            ? {
                create: guestsToCreate,
              }
            : undefined,
      },
    });

    return created;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new DuplicateRsvpError();
    }
    throw err;
  }
}

export async function listRsvpConfirmations() {
  const prisma = getPrismaClient();
  if (!prisma) {
    throw new DatabaseNotConfiguredError();
  }

  const rsvps = await prisma.rsvp.findMany({
    include: {
      guests: {
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const attendingResponses = rsvps.filter((r) => r.attending).length;
  const declinedResponses = rsvps.length - attendingResponses;
  const totalConfirmedGuests = rsvps.reduce(
    (acc, r) => acc + (r.attending ? 1 + r.companionsCount : 0),
    0
  );

  return {
    summary: {
      totalResponses: rsvps.length,
      attendingResponses,
      declinedResponses,
      totalConfirmedGuests,
    },
    items: rsvps,
  };
}
