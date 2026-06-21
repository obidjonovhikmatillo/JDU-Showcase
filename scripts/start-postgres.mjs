import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PostgresInstance } from "pg-embedded";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const dataDir = path.join(projectRoot, ".postgres-data-5433");
const pidFile = path.join(projectRoot, ".postgres-pid.json");
const envPath = path.join(projectRoot, ".env");

const instance = new PostgresInstance({
  port: 5433,
  username: "postgres",
  password: "postgres",
  persistent: true,
  dataDir,
  setupTimeout: 300,
});

await instance.start();

try {
  await instance.createDatabase("cowork_restaurants");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (!message.toLowerCase().includes("already exists")) {
    throw error;
  }
}

const databaseUrl =
  "postgresql://postgres:postgres@127.0.0.1:5433/cowork_restaurants?schema=public";

if (!existsSync(envPath)) {
  writeFileSync(
    envPath,
    `# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PostgreSQL connection string used by Prisma
DATABASE_URL="${databaseUrl}"
DIRECT_URL="${databaseUrl}"

# Auth.js
AUTH_SECRET="replace-with-openssl-rand-base64-32"
AUTH_URL=http://localhost:3000

# Cloudinary (optional in local dev)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
`,
    "utf8",
  );
  console.log("Created .env from template.");
} else {
  console.log(".env already exists — left unchanged.");
  console.log(`If needed, set DATABASE_URL and DIRECT_URL to:\n  ${databaseUrl}`);
}

writeFileSync(
  pidFile,
  JSON.stringify(
    {
      dataDir,
      port: 5433,
      databaseUrl,
    },
    null,
    2,
  ),
  "utf8",
);

console.log("Embedded PostgreSQL started.");
console.log(databaseUrl);
console.log("Keep this process running while developing. Press Ctrl+C to stop.");

process.on("SIGINT", async () => {
  await instance.stop().catch(() => undefined);
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await instance.stop().catch(() => undefined);
  process.exit(0);
});

await new Promise(() => {});
