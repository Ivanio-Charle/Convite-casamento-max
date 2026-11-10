import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { rsvpFormSchema } from "@/lib/validations/rsvp";
import { WEDDING_DATA } from "@/lib/wedding-data";
import {
  createRsvpConfirmation,
  DatabaseNotConfiguredError,
  DuplicateRsvpError,
  listRsvpConfirmations,
} from "@/services/rsvp-service";
import type { RsvpApiError, RsvpApiSuccess } from "@/types/wedding";

function getClientIp(req: NextRequest): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";

  return "local";
}

function verifyAdminToken(providedToken: string | null): {
  configured: boolean;
  authorized: boolean;
} {
  const expectedToken = process.env.RSVP_ADMIN_TOKEN?.trim();
  if (!expectedToken) {
    return { configured: false, authorized: false };
  }
  if (!providedToken) {
    return { configured: true, authorized: false };
  }

  const a = Buffer.from(providedToken.trim());
  const b = Buffer.from(expectedToken);
  if (a.length !== b.length) {
    return { configured: true, authorized: false };
  }

  return {
    configured: true,
    authorized: crypto.timingSafeEqual(a, b),
  };
}

/**
 * POST /api/rsvp
 * Regista uma nova confirmação de presença (RSVP + Acompanhantes) na base de dados PostgreSQL via Prisma.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<RsvpApiSuccess | RsvpApiError>> {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp, 8, 60_000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        code: "RATE_LIMITED",
        error: `Muitas tentativas consecutivas. Por favor, aguarda ${rateLimit.retryAfterSeconds} segundos antes de tentar novamente.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  let rawBody: unknown;
  try {
    const text = await request.text();
    if (text.length > 16_384) {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          error: "O tamanho dos dados enviados excede o limite permitido.",
        },
        { status: 413 }
      );
    }
    rawBody = JSON.parse(text);
  } catch {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Formato de pedido inválido.",
      },
      { status: 400 }
    );
  }

  // Verificação silenciosa de honeypot anti-spam
  if (
    typeof rawBody === "object" &&
    rawBody !== null &&
    "website" in rawBody &&
    typeof (rawBody as { website?: unknown }).website === "string" &&
    (rawBody as { website: string }).website.trim().length > 0
  ) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Não foi possível validar o envio do formulário.",
      },
      { status: 400 }
    );
  }

  const parsed = rsvpFormSchema.safeParse(rawBody);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const firstIssue = parsed.error.issues[0]?.message ?? "Verifica os campos assinalados.";

    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        error: firstIssue,
        fieldErrors: flattened.fieldErrors as Record<string, string[]>,
      },
      { status: 400 }
    );
  }

  const idempotencyKey = request.headers.get("x-idempotency-key");

  try {
    const created = await createRsvpConfirmation(parsed.data, idempotencyKey);

    return NextResponse.json(
      {
        success: true,
        message: WEDDING_DATA.copy.rsvpSuccessMessage,
        data: {
          id: created.id,
          fullName: created.fullName,
          attending: created.attending,
          companionsCount: created.companionsCount,
          createdAt: created.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      return NextResponse.json(
        {
          success: false,
          code: "DATABASE_NOT_CONFIGURED",
          error: error.message,
        },
        { status: 503 }
      );
    }

    if (error instanceof DuplicateRsvpError) {
      return NextResponse.json(
        {
          success: false,
          code: "DUPLICATE_RSVP",
          error: error.message,
        },
        { status: 409 }
      );
    }

    console.error("[POST /api/rsvp] Falha ao gravar na base de dados:", error);
    return NextResponse.json(
      {
        success: false,
        code: "DATABASE_CONNECTION_ERROR",
        error:
          "Não foi possível comunicar com a base de dados neste momento. A tua confirmação não foi guardada — por favor, tenta novamente dentro de instantes.",
      },
      { status: 503 }
    );
  }
}

/**
 * GET /api/rsvp
 * Consulta protegida das confirmações de presença (requer cabeçalho Authorization: Bearer <RSVP_ADMIN_TOKEN>).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7)
    : request.headers.get("x-admin-token");

  const auth = verifyAdminToken(bearerToken);

  if (!auth.configured) {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        error:
          "A consulta administrativa de confirmações requer a configuração da variável RSVP_ADMIN_TOKEN no servidor.",
      },
      { status: 503 }
    );
  }

  if (!auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        error: "Acesso não autorizado. Forneça um token administrativo válido.",
      },
      { status: 401 }
    );
  }

  try {
    const result = await listRsvpConfirmations();
    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      return NextResponse.json(
        {
          success: false,
          code: "DATABASE_NOT_CONFIGURED",
          error: error.message,
        },
        { status: 503 }
      );
    }

    console.error("[GET /api/rsvp] Erro ao consultar confirmações:", error);
    return NextResponse.json(
      {
        success: false,
        code: "DATABASE_CONNECTION_ERROR",
        error: "Erro ao consultar a base de dados PostgreSQL.",
      },
      { status: 503 }
    );
  }
}
