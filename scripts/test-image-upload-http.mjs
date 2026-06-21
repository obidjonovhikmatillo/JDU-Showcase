const baseUrl = process.env.APP_URL ?? "http://localhost:3000";

const checks = [];

function assert(name, condition) {
  checks.push({ name, ok: Boolean(condition) });
  console.log(`${condition ? "PASS" : "FAIL"} - ${name}`);
}

async function main() {
  console.log(`Testing upload API at ${baseUrl}\n`);

  const pngBytes = Uint8Array.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x00,
  ]);
  const formData = new FormData();
  formData.set("folder", "review");
  formData.set("file", new File([pngBytes], "test.png", { type: "image/png" }));

  const guestResponse = await fetch(`${baseUrl}/api/uploads`, {
    method: "POST",
    body: formData,
  });
  assert("Guest upload is unauthorized", guestResponse.status === 401);

  const invalidForm = new FormData();
  invalidForm.set("folder", "review");
  invalidForm.set(
    "file",
    new File([Uint8Array.from([1, 2, 3, 4])], "bad.gif", { type: "image/gif" }),
  );

  const invalidResponse = await fetch(`${baseUrl}/api/uploads`, {
    method: "POST",
    body: invalidForm,
  });
  assert(
    "Invalid file type is rejected for guests or unauthorized",
    invalidResponse.status === 401 || invalidResponse.status === 400,
  );

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error("\nSome upload API checks failed.");
    process.exit(1);
  }

  console.log("\nAll upload API checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
