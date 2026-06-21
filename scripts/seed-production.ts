import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

process.env.ALLOW_PRODUCTION_SEED = "true";

const result = spawnSync("npx", ["tsx", "prisma/seed.ts"], {
  cwd: path.join(root, ".."),
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
