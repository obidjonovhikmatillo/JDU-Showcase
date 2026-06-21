import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "tests", "output");
const resultsPath = path.join(root, "docs", "test-results.md");

const E2E_ID_MAP = {
  "T001 registration creates a new account": "T001",
  "T002 login allows access with valid credentials": "T002",
  "T003 logout ends the authenticated session": "T003",
  "T004 profile route is protected from guests": "T004",
  "T005 admin route is protected from guests and normal users": "T005",
  "T005 admin user can open the admin dashboard": "T005",
  "T006 language switcher changes the URL locale": "T006",
  "T007 restaurant search finds matching restaurants": "T007",
  "T008 restaurant filtering applies category filters": "T008",
  "T009 restaurant detail page loads published restaurant data": "T009",
  "T010 authenticated user can create a review": "T010",
  "T011 authenticated user can edit their review": "T011",
  "T012 authenticated user can delete their review": "T012",
  "T013 other users cannot edit someone else's review": "T013",
  "T014 admin can create a restaurant": "T014",
  "T015 admin can edit a restaurant": "T015",
  "T016 admin can delete a restaurant": "T016",
  "T019 map rendering fallback shows address text without embedded map": "T019",
  "T020 mobile navigation keeps register visible and hides desktop nav": "T020",
};

const UNIT_ID_MAP = {
  "T017 image validation": "T017",
  "T018 average rating calculation": "T018",
  "T019 map rendering fallback": "T019",
  "T020 mobile navigation layout": "T020",
  "canManageReview allows owner or admin": "T013",
  "requireAdmin allows admin role only": "T005",
};

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function collectPlaywrightResults(playwrightJson) {
  const rows = [];

  if (!playwrightJson?.suites) {
    return rows;
  }

  function walkSuites(suites) {
    for (const suite of suites) {
      for (const spec of suite.specs ?? []) {
        const title = spec.title;
        const testId = E2E_ID_MAP[title] ?? title.match(/^T\d{3}/)?.[0] ?? title;
        const test = spec.tests?.[0];
        const result = test?.results?.[0];
        const status = result?.status ?? "unknown";
        const passed = status === "passed";
        const notes = passed
          ? "Playwright E2E"
          : `Playwright E2E — ${result?.error?.message?.split("\n")[0] ?? status}`;

        rows.push({
          testId,
          actualResult: passed ? "Passed" : "Failed",
          passOrFail: passed ? "Pass" : "Fail",
          notes,
        });
      }

      if (suite.suites?.length) {
        walkSuites(suite.suites);
      }
    }
  }

  walkSuites(playwrightJson.suites);
  return rows;
}

function collectVitestResults(vitestJson) {
  const rows = [];

  if (!vitestJson?.testResults) {
    return rows;
  }

  for (const fileResult of vitestJson.testResults) {
    for (const assertion of fileResult.assertionResults ?? []) {
      const suiteName = assertion.ancestorTitles?.[0] ?? "";
      const testId =
        UNIT_ID_MAP[suiteName] ??
        suiteName.match(/^T\d{3}/)?.[0] ??
        assertion.title.match(/^T\d{3}/)?.[0] ??
        suiteName;

      const passed = assertion.status === "passed";
      rows.push({
        testId,
        actualResult: passed ? "Passed" : "Failed",
        passOrFail: passed ? "Pass" : "Fail",
        notes: passed
          ? `Vitest — ${path.basename(fileResult.name)}`
          : `Vitest — ${assertion.failureMessages?.[0]?.split("\n")[0] ?? assertion.status}`,
      });
    }
  }

  return rows;
}

function mergeByTestId(rows) {
  const merged = new Map();

  for (const row of rows) {
    const existing = merged.get(row.testId);

    if (!existing) {
      merged.set(row.testId, { ...row, notes: [row.notes] });
      continue;
    }

    existing.actualResult =
      existing.passOrFail === "Pass" && row.passOrFail === "Pass" ? "Passed" : "Failed";
    existing.passOrFail =
      existing.passOrFail === "Pass" && row.passOrFail === "Pass" ? "Pass" : "Fail";
    existing.notes.push(row.notes);
  }

  return [...merged.values()]
    .map((row) => ({
      ...row,
      notes: row.notes.join("; "),
    }))
    .sort((a, b) => a.testId.localeCompare(b.testId, undefined, { numeric: true }));
}

function formatTable(rows) {
  const header =
    "| Test ID | Actual result | Pass or fail | Notes |\n|---------|---------------|--------------|-------|";

  const body = rows
    .map(
      (row) =>
        `| ${row.testId} | ${row.actualResult} | ${row.passOrFail} | ${row.notes.replace(/\|/g, "\\|").replace(/\n/g, " ")} |`,
    )
    .join("\n");

  return `${header}\n${body}`;
}

function summarize(rows) {
  const pass = rows.filter((row) => row.passOrFail === "Pass").length;
  const fail = rows.filter((row) => row.passOrFail === "Fail").length;
  return { pass, fail, total: rows.length };
}

const playwrightJson = readJson(path.join(outputDir, "playwright-results.json"));
const vitestJson = readJson(path.join(outputDir, "vitest-results.json"));

const allRows = mergeByTestId([
  ...collectPlaywrightResults(playwrightJson),
  ...collectVitestResults(vitestJson),
]);

const { pass, fail, total } = summarize(allRows);
const generatedAt = new Date().toISOString();

const markdown = `# Test Results

Generated: ${generatedAt}

**Summary:** ${pass} passed, ${fail} failed (${total} test IDs recorded)

Run commands:

\`\`\`bash
npm run test:unit
npm run test:e2e
npm run test:all
\`\`\`

## Results

${formatTable(allRows)}

---

## Notes

- Unit tests (Vitest): T005, T013, T017, T018, T019, T020 component-level checks.
- E2E tests (Playwright): T001–T016, T019, T020 browser flows.
- T005 and T013 include both unit permission checks and E2E verification where applicable.
- Failed tests are recorded as **Fail**; do not override with manual passes.
`;

fs.mkdirSync(path.dirname(resultsPath), { recursive: true });
fs.writeFileSync(resultsPath, markdown, "utf8");

console.log(`Wrote ${resultsPath} (${pass} pass, ${fail} fail)`);
