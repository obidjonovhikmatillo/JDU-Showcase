import { PrismaClient } from "@prisma/client";

import { canManageComment } from "../lib/comments/permissions";

const prisma = new PrismaClient();

const checks: { name: string; ok: boolean }[] = [];

function assert(name: string, condition: boolean) {
  checks.push({ name, ok: condition });
  console.log(`${condition ? "PASS" : "FAIL"} - ${name}`);
}

async function main() {
  console.log("Running comment permission checks...\n");

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

  const ownedComment = await prisma.comment.findFirst({
    where: { userId: owner.id },
    select: { id: true, userId: true },
  });

  assert("Owner has at least one comment in seed data", Boolean(ownedComment));

  if (!ownedComment) {
    process.exit(1);
  }

  assert(
    "Owner can manage own comment",
    canManageComment({ id: owner.id, role: owner.role }, ownedComment.userId),
  );

  assert(
    "Another user cannot manage someone else's comment",
    !canManageComment({ id: otherUser.id, role: otherUser.role }, ownedComment.userId),
  );

  assert(
    "Admin can manage any comment",
    canManageComment({ id: admin.id, role: admin.role }, ownedComment.userId),
  );

  assert("Guest cannot manage comments", !canManageComment(null, ownedComment.userId));

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${checks.length} comment permission checks passed.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
