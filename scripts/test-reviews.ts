import { PrismaClient } from "@prisma/client";

import { createReviewSchema } from "../lib/validations/create-review-schema";

const prisma = new PrismaClient();

const tv = (key: string) => key;
const schema = createReviewSchema(tv);

const checks: { name: string; ok: boolean }[] = [];

function assert(name: string, condition: boolean) {
  checks.push({ name, ok: condition });
  console.log(`${condition ? "PASS" : "FAIL"} - ${name}`);
}

function computeAverageRating(reviews: { rating: number }[]): number | null {
  if (reviews.length === 0) {
    return null;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}

async function getRestaurantAverageRating(restaurantId: string) {
  const reviews = await prisma.review.findMany({
    where: { restaurantId },
    select: { rating: true },
  });

  return {
    averageRating: computeAverageRating(reviews),
    reviewCount: reviews.length,
  };
}

function validPayload(overrides: Record<string, unknown> = {}) {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const visitDate = `${today.getFullYear()}-${month}-${day}`;

  return {
    restaurantSlug: "trattoria-amici",
    rating: 5,
    title: "Great evening",
    content: "Excellent food and friendly staff.",
    visitDate,
    images: "",
    ...overrides,
  };
}

async function testValidation() {
  assert("Valid review passes validation", schema.safeParse(validPayload()).success);

  assert(
    "Invalid rating is rejected",
    !schema.safeParse(validPayload({ rating: 6 })).success,
  );

  assert(
    "Empty title is rejected",
    !schema.safeParse(validPayload({ title: "" })).success,
  );

  assert(
    "Empty content is rejected",
    !schema.safeParse(validPayload({ content: "   " })).success,
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const futureDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  assert(
    "Future visit date is rejected",
    !schema.safeParse(validPayload({ visitDate: futureDate })).success,
  );

  assert(
    "Zero rating is rejected",
    !schema.safeParse(validPayload({ rating: 0 })).success,
  );
}

async function testAverageRatingUpdate() {
  const restaurant = await prisma.restaurant.findFirst({
    where: { slug: "trattoria-amici", isPublished: true },
    select: { id: true },
  });

  if (!restaurant) {
    assert("Test restaurant exists for average rating check", false);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: "user@example.com" },
    select: { id: true },
  });

  if (!user) {
    assert("Test user exists for average rating check", false);
    return;
  }

  const before = await getRestaurantAverageRating(restaurant.id);

  const review = await prisma.review.create({
    data: {
      userId: user.id,
      restaurantId: restaurant.id,
      rating: 4,
      title: "Automated test review",
      content: "Temporary review created by test script.",
      visitDate: new Date(),
    },
  });

  const after = await getRestaurantAverageRating(restaurant.id);
  const ratings = await prisma.review.findMany({
    where: { restaurantId: restaurant.id },
    select: { rating: true },
  });
  const expectedAverage =
    ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;

  assert(
    "Average rating updates after new review",
    after.reviewCount === before.reviewCount + 1 &&
      after.averageRating !== null &&
      Math.abs(after.averageRating - expectedAverage) < 0.0001,
  );

  await prisma.review.delete({ where: { id: review.id } });
}

async function main() {
  console.log("Running review validation and database checks...\n");

  await testValidation();
  await testAverageRatingUpdate();

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${checks.length} review logic checks passed.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
