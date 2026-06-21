import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.restaurant.findFirst({
      where: { slug: "trattoria-amici", isPublished: true },
      include: {
        category: true,
      images: {
        orderBy: { createdAt: "asc" },
      },
        reviews: {
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
