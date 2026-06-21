import { PrismaClient } from "@prisma/client";

const globalForAuthPrisma = globalThis as unknown as {
  authPrisma: PrismaClient | undefined;
};

/**
 * Raw Prisma client for authentication flows that require passwordHash.
 * Do not use this client in API responses or UI layers.
 */
export const authPrisma: PrismaClient =
  globalForAuthPrisma.authPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForAuthPrisma.authPrisma = authPrisma;
}

export async function findUserWithPasswordByEmail(email: string) {
  const baseSelect = {
    id: true,
    email: true,
    passwordHash: true,
    fullName: true,
    role: true,
    preferredLanguage: true,
    avatarUrl: true,
    isActive: true,
  } as const;

  try {
    return await authPrisma.user.findUnique({
      where: { email },
      select: { ...baseSelect, profileHeadline: true },
    });
  } catch {
    return authPrisma.user.findUnique({
      where: { email },
      select: baseSelect,
    });
  }
}
