import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const expected = {
  usersMin: 4,
  categories: 5,
  projects: 12,
  commentsMin: 20,
  projectImagesMin: 10,
  commentImagesMin: 6,
};

async function main() {
  const [users, categories, projects, comments, projectImages, commentImages] =
    await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.project.count(),
      prisma.comment.count(),
      prisma.projectImage.count(),
      prisma.commentImage.count(),
    ]);

  const checks = [
    ["users", users, expected.usersMin, "gte"],
    ["categories", categories, expected.categories, "eq"],
    ["projects", projects, expected.projects, "eq"],
    ["comments", comments, expected.commentsMin, "gte"],
    ["projectImages", projectImages, expected.projectImagesMin, "gte"],
    ["commentImages", commentImages, expected.commentImagesMin, "gte"],
  ] as const;

  let failed = false;

  for (const [label, actual, target, operator] of checks) {
    const ok = operator === "gte" ? actual >= target : actual === target;

    console.log(
      `${ok ? "OK" : "FAIL"} ${label}: ${actual}${
        operator === "gte" ? ` (expected >= ${target})` : ` (expected ${target})`
      }`,
    );

    if (!ok) {
      failed = true;
    }
  }

  const admin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
    select: { email: true, role: true },
  });

  const sampleProject = await prisma.project.findUnique({
    where: { slug: "campus-connect-portal" },
    include: {
      category: true,
      images: true,
      comments: { include: { images: true }, take: 1 },
    },
  });

  console.log("\nSample admin:", admin);
  console.log(
    "Sample project:",
    sampleProject
      ? {
          title: sampleProject.title,
          category: sampleProject.category.slug,
          galleryCount: sampleProject.images.length,
          commentSampleImages: sampleProject.comments[0]?.images.length ?? 0,
        }
      : null,
  );

  if (failed) {
    process.exit(1);
  }

  console.log("\nSeed verification passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
