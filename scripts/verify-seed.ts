import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const expected = {
  usersMin: 4,
  categories: 8,
  restaurants: 12,
  reviewsMin: 20,
  restaurantImagesMin: 20,
  reviewImagesMin: 8,
};

async function main() {
  const [users, categories, restaurants, reviews, restaurantImages, reviewImages] =
    await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.restaurant.count(),
      prisma.review.count(),
      prisma.restaurantImage.count(),
      prisma.reviewImage.count(),
    ]);

  const checks = [
    ["users", users, expected.usersMin, "gte"],
    ["categories", categories, expected.categories, "eq"],
    ["restaurants", restaurants, expected.restaurants, "eq"],
    ["reviews", reviews, expected.reviewsMin, "gte"],
    ["restaurantImages", restaurantImages, expected.restaurantImagesMin, "gte"],
    ["reviewImages", reviewImages, expected.reviewImagesMin, "gte"],
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

  const sampleRestaurant = await prisma.restaurant.findUnique({
    where: { slug: "plov-markazi-chorsu" },
    include: {
      category: true,
      images: true,
      reviews: { include: { images: true }, take: 1 },
    },
  });

  console.log("\nSample admin:", admin);
  console.log(
    "Sample restaurant:",
    sampleRestaurant
      ? {
          name: sampleRestaurant.name,
          category: sampleRestaurant.category.slug,
          galleryCount: sampleRestaurant.images.length,
          reviewSampleImages: sampleRestaurant.reviews[0]?.images.length ?? 0,
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
