import { getProductionEnvIssues } from "@/lib/env";

const issues = getProductionEnvIssues();

if (issues.length === 0) {
  console.log("Production environment check passed.");
  process.exit(0);
}

console.error("Production environment issues:\n");

for (const issue of issues) {
  const prefix = issue.severity === "error" ? "ERROR" : "WARN";
  console.error(`  [${prefix}] ${issue.key}: ${issue.message}`);
}

const hasErrors = issues.some((issue) => issue.severity === "error");
process.exit(hasErrors ? 1 : 0);
