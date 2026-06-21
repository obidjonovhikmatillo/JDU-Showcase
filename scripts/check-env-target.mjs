import { existsSync, readFileSync } from "node:fs";

const envPath = ".env";

if (!existsSync(envPath)) {
  console.log("ENV_FILE=missing");
  process.exit(0);
}

const text = readFileSync(envPath, "utf8");

function get(key) {
  const match = text.match(new RegExp(`^${key}=(.*)$`, "m"));
  if (!match) return "";
  return match[1].replace(/^["']|["']$/g, "").trim();
}

const databaseUrl = get("DATABASE_URL");
const directUrl = get("DIRECT_URL");
const isNeon = (url) => /neon\.tech/i.test(url);
const isPooler = (url) => /-pooler|pooler/i.test(url);
const isLocal = (url) => /localhost|127\.0\.0\.1|:5432|:5433/.test(url);

console.log(`DATABASE_URL_set=${Boolean(databaseUrl)}`);
console.log(`DIRECT_URL_set=${Boolean(directUrl)}`);
console.log(`DATABASE_URL_neon=${isNeon(databaseUrl)}`);
console.log(`DIRECT_URL_neon=${isNeon(directUrl)}`);
console.log(`DATABASE_URL_pooler=${isPooler(databaseUrl)}`);
console.log(`DIRECT_URL_pooler=${isPooler(directUrl)}`);
console.log(`DATABASE_URL_local=${isLocal(databaseUrl)}`);
console.log(`DIRECT_URL_local=${isLocal(directUrl)}`);

const validNeon =
  isNeon(databaseUrl) &&
  isNeon(directUrl) &&
  isPooler(databaseUrl) &&
  !isPooler(directUrl) &&
  !isLocal(databaseUrl) &&
  !isLocal(directUrl);

console.log(`NEON_READY=${validNeon}`);
