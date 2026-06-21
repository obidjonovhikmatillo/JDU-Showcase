import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");

function loadEnvFile() {
  if (!existsSync(envPath)) {
    return {};
  }

  const text = readFileSync(envPath, "utf8");
  const entries = {};

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    entries[key] = value;
  }

  return entries;
}

function analyzeNeon(databaseUrl, directUrl) {
  const isNeon = (url) => /neon\.tech/i.test(url);
  const isPooler = (url) => /-pooler|pooler/i.test(url);
  const isLocal = (url) => /localhost|127\.0\.0\.1|:5432|:5433/.test(url);

  return {
    databaseUrlSet: Boolean(databaseUrl),
    directUrlSet: Boolean(directUrl),
    neonReady:
      Boolean(databaseUrl && directUrl) &&
      isNeon(databaseUrl) &&
      isNeon(directUrl) &&
      isPooler(databaseUrl) &&
      !isPooler(directUrl) &&
      !isLocal(databaseUrl) &&
      !isLocal(directUrl),
  };
}

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  const fileEnv = loadEnvFile();
  const databaseUrl = fileEnv.DATABASE_URL ?? process.env.DATABASE_URL ?? "";
  const directUrl = fileEnv.DIRECT_URL ?? process.env.DIRECT_URL ?? "";
  const analysis = analyzeNeon(databaseUrl, directUrl);

  if (!analysis.neonReady) {
    console.error("\nNeon production URLs are not configured.");
    console.error("Update web-app/.env with these two values from the Neon dashboard:\n");
    console.error("  DATABASE_URL  -> Pooled connection string (host contains -pooler)");
    console.error("  DIRECT_URL    -> Direct connection string (same host WITHOUT -pooler)");
    console.error("\nThen rerun: npm run db:migrate:production\n");
    process.exit(1);
  }

  console.log("\nApplying Prisma migrations to Neon (migrate deploy)...\n");
  run("npx", ["prisma", "migrate", "deploy"], { DATABASE_URL: databaseUrl, DIRECT_URL: directUrl });

  console.log("\nGenerating Prisma client...\n");
  run("npx", ["prisma", "generate"], { DATABASE_URL: databaseUrl, DIRECT_URL: directUrl });

  console.log("\nSeeding production database (idempotent upsert)...\n");
  run("npm", ["run", "db:seed:production"], {
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
    ALLOW_PRODUCTION_SEED: "true",
  });

  console.log("\nVerifying seeded data...\n");
  run("npm", ["run", "db:seed:verify"], { DATABASE_URL: databaseUrl, DIRECT_URL: directUrl });

  console.log("\nNeon production database is ready.\n");
}

main();
