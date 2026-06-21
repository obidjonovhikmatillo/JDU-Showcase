import "server-only";

import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientWithSafeUser | undefined;
};

function withPasswordHashOmitted<T extends { omit?: Prisma.UserOmit | null }>(
  args: T,
): T {
  return {
    ...args,
    omit: {
      ...(args.omit ?? {}),
      passwordHash: true,
    },
  };
}

function shouldOmitPasswordHash<T extends { omit?: Prisma.UserOmit | null; select?: unknown }>(
  args: T,
): boolean {
  return !args.select;
}

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends({
    query: {
      user: {
        findUnique({ args, query }) {
          return query(
            shouldOmitPasswordHash(args) ? withPasswordHashOmitted(args) : args,
          );
        },
        findFirst({ args, query }) {
          return query(
            shouldOmitPasswordHash(args) ? withPasswordHashOmitted(args) : args,
          );
        },
        findMany({ args, query }) {
          return query(
            shouldOmitPasswordHash(args) ? withPasswordHashOmitted(args) : args,
          );
        },
        findFirstOrThrow({ args, query }) {
          return query(
            shouldOmitPasswordHash(args) ? withPasswordHashOmitted(args) : args,
          );
        },
        findUniqueOrThrow({ args, query }) {
          return query(
            shouldOmitPasswordHash(args) ? withPasswordHashOmitted(args) : args,
          );
        },
      },
    },
  });
}

export type PrismaClientWithSafeUser = ReturnType<typeof createPrismaClient>;

export const prisma: PrismaClientWithSafeUser =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
