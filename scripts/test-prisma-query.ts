import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.project.findFirst({
      where: { slug: "campus-connect-portal", isPublished: true },
      include: {
        category: true,
        images: {
          orderBy: { createdAt: "asc" },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
            images: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });
    console.log("Query OK");
  } catch (error) {
    console.error("Query failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
