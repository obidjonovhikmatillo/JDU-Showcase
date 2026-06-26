const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const locale = "en";

const testCases = [
  { name: "all projects", path: "/projects" },
  { name: "search by title", path: "/projects?q=campus" },
  { name: "search author", path: "/projects?q=Bobur" },
  { name: "category filter", path: "/projects?category=web-development" },
  { name: "department filter", path: "/projects?department=Computer+Science" },
  { name: "min rating", path: "/projects?minRating=4" },
  { name: "sort comments", path: "/projects?sort=comments" },
  { name: "sort newest", path: "/projects?sort=newest" },
  { name: "sort title", path: "/projects?sort=title" },
  { name: "list view", path: "/projects?view=list" },
  { name: "pagination page 2", path: "/projects?page=2" },
  {
    name: "combined filters",
    path: "/projects?q=app&category=mobile-app&minRating=3&sort=rating&view=grid",
  },
  {
    name: "empty result",
    path: "/projects?q=nonexistent-project-xyz",
  },
];

let failures = 0;

async function testCase({ name, path }) {
  const url = `${baseUrl}/${locale}${path}`;
  const response = await fetch(url, { redirect: "manual" });

  if (response.status !== 200) {
    console.error(`FAIL ${name} -> HTTP ${response.status} (${url})`);
    failures += 1;
    return;
  }

  const html = await response.text();
  const hasResults = html.includes("projects found") || html.includes("project found");
  const hasCards = html.includes("View details") || html.includes("viewDetails");
  const hasEmpty = html.includes("No projects found");

  if (path.includes("nonexistent")) {
    if (!hasEmpty) {
      console.error(`FAIL ${name} -> expected empty state`);
      failures += 1;
    } else {
      console.log(`OK   ${name}`);
    }
    return;
  }

  if (!hasResults && !hasCards) {
    console.error(`FAIL ${name} -> no project listing rendered`);
    failures += 1;
    return;
  }

  console.log(`OK   ${name}`);
}

async function main() {
  console.log(`Testing project discovery at ${baseUrl}/${locale}\n`);

  for (const test of testCases) {
    await testCase(test);
  }

  if (failures > 0) {
    process.exit(1);
  }

  console.log(`\nAll ${testCases.length} discovery checks passed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
