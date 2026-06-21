import { PrismaClient } from "@prisma/client";

import {
  canAccessAdmin,
  canChangeUserRole,
  canDeactivateUser,
} from "../lib/admin/access";

const prisma = new PrismaClient();

const checks: { name: string; ok: boolean }[] = [];

function assert(name: string, condition: boolean) {
  checks.push({ name, ok: condition });
  console.log(`${condition ? "PASS" : "FAIL"} - ${name}`);
}

async function main() {
  console.log("Running admin permission checks...\n");

  const regularUser = await prisma.user.findUnique({
    where: { email: "user@example.com" },
    select: { id: true, role: true },
  });
  const admin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
    select: { id: true, role: true },
  });

  assert("Seed regular user exists", Boolean(regularUser));
  assert("Seed admin user exists", Boolean(admin));

  if (!regularUser || !admin) {
    process.exit(1);
  }

  assert("Regular user cannot access admin", !canAccessAdmin(regularUser));
  assert("Admin user can access admin", canAccessAdmin(admin));
  assert("Guest cannot access admin", !canAccessAdmin(null));

  assert(
    "Admin cannot deactivate themselves",
    !canDeactivateUser(admin.id, admin.id, false),
  );
  assert(
    "Admin can deactivate another user",
    canDeactivateUser(admin.id, regularUser.id, false),
  );
  assert(
    "Admin can activate themselves",
    canDeactivateUser(admin.id, admin.id, true),
  );

  assert(
    "Admin cannot demote themselves",
    !canChangeUserRole(admin.id, admin.id, "USER"),
  );
  assert(
    "Admin can promote another user",
    canChangeUserRole(admin.id, regularUser.id, "ADMIN"),
  );
  assert(
    "Admin can keep their own admin role",
    canChangeUserRole(admin.id, admin.id, "ADMIN"),
  );

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${checks.length} admin permission checks passed.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
