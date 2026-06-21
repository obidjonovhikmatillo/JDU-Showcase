import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tables = await prisma.$queryRawUnsafe(
  "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename",
);

console.log("Tables:", tables);

await prisma.$disconnect();
