// This imports the Prisma Client that was generated when we ran:
// npx prisma generate
// Without that command, this import would not exist.
import { PrismaClient } from "@prisma/client";

// We create a type for the global object so TypeScript knows
// that it may contain a Prisma Client instance.
const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

// Reuse the existing Prisma Client if it already exists.
// Otherwise, create a new one.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // During development, Prisma logs:
    // - SQL queries
    // - Errors
    // - Warnings
    log:
    process.env.NODE_ENV === "development"
      ? ["error", "warn"]
      : ["error"],
  });

// In development, store the Prisma Client globally
// so that Next.js Hot Reload doesn't create multiple
// database connections.
//
// In production, each server process manages its own
// Prisma Client, so we don't store it globally.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}