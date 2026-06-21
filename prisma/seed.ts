import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  categories,
  restaurants,
  reviews,
  users,
} from "./seed-data";

const prisma = new PrismaClient();

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

async function seedRestaurants(categoryIds: Map<string, string>) {
  const seeded = new Map<string, string>();

  for (const restaurant of restaurants) {
    const categoryId = categoryIds.get(restaurant.categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category for restaurant: ${restaurant.slug}`);
    }

    const record = await prisma.restaurant.upsert({
      where: { slug: restaurant.slug },
      update: {
        name: restaurant.name,
        descriptionUz: restaurant.descriptionUz,
        descriptionEn: restaurant.descriptionEn,
        descriptionRu: restaurant.descriptionRu,
        descriptionJa: restaurant.descriptionJa,
        address: restaurant.address,
        city: restaurant.city,
        phone: restaurant.phone,
        website: restaurant.website ?? null,
        openingHours: restaurant.openingHours,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        mainImageUrl: restaurant.mainImageUrl,
        priceLevel: restaurant.priceLevel,
        cuisineType: restaurant.cuisineType,
        isPublished: restaurant.isPublished,
        categoryId,
      },
      create: {
        name: restaurant.name,
        slug: restaurant.slug,
        descriptionUz: restaurant.descriptionUz,
        descriptionEn: restaurant.descriptionEn,
        descriptionRu: restaurant.descriptionRu,
        descriptionJa: restaurant.descriptionJa,
        address: restaurant.address,
        city: restaurant.city,
        phone: restaurant.phone,
        website: restaurant.website,
        openingHours: restaurant.openingHours,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        mainImageUrl: restaurant.mainImageUrl,
        priceLevel: restaurant.priceLevel,
        cuisineType: restaurant.cuisineType,
        isPublished: restaurant.isPublished,
        categoryId,
      },
    });

    await prisma.restaurantImage.deleteMany({
      where: { restaurantId: record.id },
    });

    if (restaurant.galleryImageUrls.length > 0) {
      await prisma.restaurantImage.createMany({
        data: restaurant.galleryImageUrls.map((imageUrl) => ({
          restaurantId: record.id,
          imageUrl,
        })),
      });
    }

    seeded.set(restaurant.slug, record.id);
  }

  return seeded;
}

async function seedReviews(
  userIds: Map<string, string>,
  restaurantIds: Map<string, string>,
) {
  for (const review of reviews) {
    const userId = userIds.get(review.userEmail);
    const restaurantId = restaurantIds.get(review.restaurantSlug);

    if (!userId || !restaurantId) {
      throw new Error(
        `Missing user or restaurant for review: ${review.title}`,
      );
    }

    const existing = await prisma.review.findFirst({
      where: {
        userId,
        restaurantId,
        title: review.title,
      },
    });

    const reviewData = {
      userId,
      restaurantId,
      rating: review.rating,
      title: review.title,
      content: review.content,
      visitDate: review.visitDate ? new Date(review.visitDate) : null,
    };

    const record = existing
      ? await prisma.review.update({
          where: { id: existing.id },
          data: reviewData,
        })
      : await prisma.review.create({
          data: reviewData,
        });

    await prisma.reviewImage.deleteMany({
      where: { reviewId: record.id },
    });

    if (review.imageUrls?.length) {
      await prisma.reviewImage.createMany({
        data: review.imageUrls.map((imageUrl) => ({
          reviewId: record.id,
          imageUrl,
        })),
      });
    }
  }
}

async function printSummary() {
  const [userCount, categoryCount, restaurantCount, reviewCount, restaurantImageCount, reviewImageCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.restaurant.count(),
      prisma.review.count(),
      prisma.restaurantImage.count(),
      prisma.reviewImage.count(),
    ]);

  console.log("\nSeed summary:");
  console.log(`  Users:              ${userCount}`);
  console.log(`  Categories:         ${categoryCount}`);
  console.log(`  Restaurants:        ${restaurantCount}`);
  console.log(`  Reviews:            ${reviewCount}`);
  console.log(`  Restaurant images:  ${restaurantImageCount}`);
  console.log(`  Review images:      ${reviewImageCount}`);
}

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
    console.error(
      "\nRefusing to seed production database.\n" +
        "Set ALLOW_PRODUCTION_SEED=true if you intentionally want to seed production.\n",
    );
    process.exit(1);
  }

  console.log("Seeding TasteGuide demo data...\n");

  const userIds = await seedUsers();
  const categoryIds = await seedCategories();
  const restaurantIds = await seedRestaurants(categoryIds);

  await seedReviews(userIds, restaurantIds);
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
