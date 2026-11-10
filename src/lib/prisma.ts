import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Verifica se a variável DATABASE_URL está devidamente preenchida com um URL PostgreSQL válido.
 * Nunca cria credenciais fictícias nem simula ligação à base de dados.
 */
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  return url.startsWith("postgresql://") || url.startsWith("postgres://");
}

function createPrismaClient(connectionString: string): PrismaClient {
  const isNeonHost = /\.neon\.tech(?::|\/|$)/i.test(connectionString);

  if (isNeonHost) {
    // Driver serverless oficial do Neon — compatível com Node.js e Cloudflare Workers
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // Ligação PostgreSQL standard (local, Docker ou servidor dedicado)
  const adapter = new PrismaPg({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 8000,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export function getPrismaClient(): PrismaClient | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const connectionString = process.env.DATABASE_URL!.trim();

  if (process.env.NODE_ENV !== "production") {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient(connectionString);
    }
    return globalForPrisma.prisma;
  }

  return createPrismaClient(connectionString);
}
