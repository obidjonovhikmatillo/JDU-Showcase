import { authPrisma } from "@/lib/prisma-auth";
import { registerUser } from "@/lib/actions/register";

async function main() {
  const unique = Date.now();
  const email = `register${unique}@example.com`;

  const formData = new FormData();
  formData.set("fullName", "Registration Test");
  formData.set("email", email);
  formData.set("password", "Test1234!");
  formData.set("confirmPassword", "Test1234!");
  formData.set("preferredLanguage", "EN");

  const first = await registerUser({}, formData);
  console.log(first.success ? "PASS - Registration creates account" : "FAIL - Registration");

  const created = await authPrisma.user.findUnique({ where: { email } });
  console.log(created ? "PASS - User persisted in database" : "FAIL - User not found");

  const duplicate = await registerUser({}, formData);
  const duplicateBlocked = Boolean(duplicate.fieldErrors?.email?.length);
  console.log(
    duplicateBlocked
      ? "PASS - Duplicate email blocked"
      : "FAIL - Duplicate email should be blocked",
  );

  if (!first.success || !created || !duplicateBlocked) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
