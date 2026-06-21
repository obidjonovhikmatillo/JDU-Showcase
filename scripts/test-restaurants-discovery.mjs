const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const locale = "en";

const testCases = [
  { name: "all restaurants", path: "/restaurants" },
  { name: "search by name", path: "/restaurants?q=plov" },
  { name: "search address", path: "/restaurants?q=Chorsu" },
  { name: "category filter", path: "/restaurants?category=uzbek-cuisine" },
  { name: "city filter", path: "/restaurants?city=Tashkent" },
  { name: "min rating", path: "/restaurants?minRating=4" },
  { name: "price filter", path: "/restaurants?price=2" },
  { name: "sort reviews", path: "/restaurants?sort=reviews" },
  { name: "sort newest", path: "/restaurants?sort=newest" },
  { name: "sort name", path: "/restaurants?sort=name" },
  { name: "list view", path: "/restaurants?view=list" },
  { name: "pagination page 2", path: "/restaurants?page=2" },
  {
    name: "combined filters",
    path: "/restaurants?q=tashkent&category=fast-food&minRating=3&sort=rating&view=grid",
  },
  {
    name: "empty result",
    path: "/restaurants?q=nonexistent-restaurant-xyz",
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
  const hasResults = html.includes("restaurants found") || html.includes("restaurant found");
  const hasCards = html.includes("View details") || html.includes("viewDetails");
  const hasEmpty = html.includes("No restaurants found");

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
    console.error(`FAIL ${name} -> no restaurant listing rendered`);
    failures += 1;
    return;
  }

  console.log(`OK   ${name}`);
}

async function main() {
  console.log(`Testing restaurant discovery at ${baseUrl}/${locale}\n`);

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
