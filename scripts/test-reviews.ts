import { PrismaClient } from "@prisma/client";

import { createCommentSchema } from "../lib/validations/create-comment-schema";

const prisma = new PrismaClient();

const tv = (key: string) => key;
const schema = createCommentSchema(tv);

const checks: { name: string; ok: boolean }[] = [];

function assert(name: string, condition: boolean) {
  checks.push({ name, ok: condition });
  console.log(`${condition ? "PASS" : "FAIL"} - ${name}`);
}

function computeAverageRating(comments: { rating: number }[]): number | null {
  if (comments.length === 0) {
    return null;
  }

  const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
  return total / comments.length;
}

async function getProjectAverageRating(projectId: string) {
  const comments = await prisma.comment.findMany({
    where: { projectId },
    select: { rating: true },
  });

  return {
    averageRating: computeAverageRating(comments),
    commentCount: comments.length,
  };
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    projectSlug: "campus-connect-portal",
    rating: 5,
    title: "Great project",
    content: "Excellent work and clean code.",
    images: "",
    ...overrides,
  };
}

async function testValidation() {
  assert("Valid comment passes validation", schema.safeParse(validPayload()).success);

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

  assert(
    "Zero rating is rejected",
    !schema.safeParse(validPayload({ rating: 0 })).success,
  );
}

async function testAverageRatingUpdate() {
  const project = await prisma.project.findFirst({
    where: { slug: "campus-connect-portal", isPublished: true },
    select: { id: true },
  });

  if (!project) {
    assert("Test project exists for average rating check", false);
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

  const before = await getProjectAverageRating(project.id);

  const comment = await prisma.comment.create({
    data: {
      userId: user.id,
      projectId: project.id,
      rating: 4,
      title: "Automated test comment",
      content: "Temporary comment created by test script.",
    },
  });

  const after = await getProjectAverageRating(project.id);
  const ratings = await prisma.comment.findMany({
    where: { projectId: project.id },
    select: { rating: true },
  });
  const expectedAverage =
    ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;

  assert(
    "Average rating updates after new comment",
    after.commentCount === before.commentCount + 1 &&
      after.averageRating !== null &&
      Math.abs(after.averageRating - expectedAverage) < 0.0001,
  );

  await prisma.comment.delete({ where: { id: comment.id } });
}

async function main() {
  console.log("Running comment validation and database checks...\n");

  await testValidation();
  await testAverageRatingUpdate();

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${checks.length} comment logic checks passed.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
