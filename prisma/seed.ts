import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  categories,
  projects,
  comments,
  users,
} from "./seed-data";

const prisma = new PrismaClient();

async function cleanDatabase() {
  await prisma.commentImage.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.projectLike.deleteMany();
  await prisma.projectSave.deleteMany();
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const seeded = new Map<string, string>();

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 12);

    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        passwordHash,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        isActive: true,
      },
      create: {
        fullName: user.fullName,
        email: user.email,
        passwordHash,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
      },
    });

    seeded.set(user.email, record.id);
  }

  return seeded;
}

async function seedCategories() {
  const seeded = new Map<string, string>();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        nameUz: category.nameUz,
        nameEn: category.nameEn,
        nameRu: category.nameRu,
        nameJa: category.nameJa,
      },
      create: category,
    });

    seeded.set(category.slug, record.id);
  }

  return seeded;
}

async function seedProjects(categoryIds: Map<string, string>) {
  const seeded = new Map<string, string>();

  for (const project of projects) {
    const categoryId = categoryIds.get(project.categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category for project: ${project.slug}`);
    }

    const record = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        descriptionUz: project.descriptionUz,
        descriptionEn: project.descriptionEn,
        descriptionRu: project.descriptionRu,
        descriptionJa: project.descriptionJa,
        authorName: project.authorName,
        department: project.department,
        techStack: project.techStack ?? null,
        demoUrl: project.demoUrl ?? null,
        githubUrl: project.githubUrl ?? null,
        mainImageUrl: project.mainImageUrl,
        difficulty: project.difficulty ?? null,
        isPublished: project.isPublished,
        categoryId,
      },
      create: {
        title: project.title,
        slug: project.slug,
        descriptionUz: project.descriptionUz,
        descriptionEn: project.descriptionEn,
        descriptionRu: project.descriptionRu,
        descriptionJa: project.descriptionJa,
        authorName: project.authorName,
        department: project.department,
        techStack: project.techStack,
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
        mainImageUrl: project.mainImageUrl,
        difficulty: project.difficulty,
        isPublished: project.isPublished,
        categoryId,
      },
    });

    await prisma.projectImage.deleteMany({
      where: { projectId: record.id },
    });

    if (project.galleryImageUrls.length > 0) {
      await prisma.projectImage.createMany({
        data: project.galleryImageUrls.map((imageUrl) => ({
          projectId: record.id,
          imageUrl,
        })),
      });
    }

    seeded.set(project.slug, record.id);
  }

  return seeded;
}

async function seedComments(
  userIds: Map<string, string>,
  projectIds: Map<string, string>,
) {
  for (const comment of comments) {
    const userId = userIds.get(comment.userEmail);
    const projectId = projectIds.get(comment.projectSlug);

    if (!userId || !projectId) {
      throw new Error(
        `Missing user or project for comment: ${comment.title}`,
      );
    }

    const existing = await prisma.comment.findFirst({
      where: {
        userId,
        projectId,
        title: comment.title,
      },
    });

    const commentData = {
      userId,
      projectId,
      rating: comment.rating,
      title: comment.title,
      content: comment.content,
    };

    const record = existing
      ? await prisma.comment.update({
          where: { id: existing.id },
          data: commentData,
        })
      : await prisma.comment.create({
          data: commentData,
        });

    await prisma.commentImage.deleteMany({
      where: { commentId: record.id },
    });

    if (comment.imageUrls?.length) {
      await prisma.commentImage.createMany({
        data: comment.imageUrls.map((imageUrl) => ({
          commentId: record.id,
          imageUrl,
        })),
      });
    }
  }
}

async function printSummary() {
  const [userCount, categoryCount, projectCount, commentCount, projectImageCount, commentImageCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.project.count(),
      prisma.comment.count(),
      prisma.projectImage.count(),
      prisma.commentImage.count(),
    ]);

  console.log("\nSeed summary:");
  console.log(`  Users:            ${userCount}`);
  console.log(`  Categories:       ${categoryCount}`);
  console.log(`  Projects:         ${projectCount}`);
  console.log(`  Comments:         ${commentCount}`);
  console.log(`  Project images:   ${projectImageCount}`);
  console.log(`  Comment images:   ${commentImageCount}`);
}

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
    console.error(
      "\nRefusing to seed production database.\n" +
        "Set ALLOW_PRODUCTION_SEED=true if you intentionally want to seed production.\n",
    );
    process.exit(1);
  }

  console.log("Cleaning existing data...");
  await cleanDatabase();
  console.log("Seeding JDU Showcase demo data...\n");

  const userIds = await seedUsers();
  const categoryIds = await seedCategories();
  const projectIds = await seedProjects(categoryIds);

  await seedComments(userIds, projectIds);
  await printSummary();

  console.log("\nDemo credentials:");
  console.log("  ADMIN → admin@example.com / Admin123!");
  console.log("  USER  → user@example.com / User123!");
  console.log("  USER  → aziza@example.com / User123!");
  console.log("  USER  → kenji@example.com / User123!");
  console.log("\nSeed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
