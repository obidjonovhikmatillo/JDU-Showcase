import { PrismaClient } from "@prisma/client";

import { canManageReview } from "../lib/reviews/permissions";

const prisma = new PrismaClient();

const checks: { name: string; ok: boolean }[] = [];

function assert(name: string, condition: boolean) {
  checks.push({ name, ok: condition });
  console.log(`${condition ? "PASS" : "FAIL"} - ${name}`);
}

async function main() {
  console.log("Running review permission checks...\n");

  const owner = await prisma.user.findUnique({
    where: { email: "user@example.com" },
    select: { id: true, role: true },
  });
  const otherUser = await prisma.user.findUnique({
    where: { email: "aziza@example.com" },
    select: { id: true, role: true },
  });
  const admin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
    select: { id: true, role: true },
  });

  assert("Seed owner user exists", Boolean(owner));
  assert("Seed other user exists", Boolean(otherUser));
  assert("Seed admin user exists", Boolean(admin));

  if (!owner || !otherUser || !admin) {
    process.exit(1);
  }

  const ownedReview = await prisma.review.findFirst({
    where: { userId: owner.id },
    select: { id: true, userId: true },
  });

  assert("Owner has at least one review in seed data", Boolean(ownedReview));

  if (!ownedReview) {
    process.exit(1);
  }

  assert(
    "Owner can manage own review",
    canManageReview({ id: owner.id, role: owner.role }, ownedReview.userId),
  );

  assert(
    "Another user cannot manage someone else's review",
    !canManageReview({ id: otherUser.id, role: otherUser.role }, ownedReview.userId),
  );

  assert(
    "Admin can manage any review",
    canManageReview({ id: admin.id, role: admin.role }, ownedReview.userId),
  );

  assert("Guest cannot manage reviews", !canManageReview(null, ownedReview.userId));

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${checks.length} review permission checks passed.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
