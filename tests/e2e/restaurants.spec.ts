import { expect, test } from "@playwright/test";

import { SEED_PROJECT_TITLE, SEED_PROJECT_SLUG } from "../helpers/playwright-auth";

test.describe("Project discovery", () => {
  test("T007 project search finds matching projects", async ({ page }) => {
    await page.goto("/en/projects", { waitUntil: "networkidle" });
    const searchInput = page.getByRole("searchbox", {
      name: /search by title, author, department/i,
    });
    await searchInput.fill("Campus");
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/q=Campus/i, { timeout: 10_000 });
    await expect(page.getByRole("link", { name: /Campus Connect Portal/i })).toBeVisible();
  });

  test("T008 project filtering applies category filters", async ({ page }) => {
    await page.goto("/en/projects", { waitUntil: "networkidle" });
    await page.getByRole("combobox", { name: /^category$/i }).selectOption("web-development");
    await expect(page).toHaveURL(/category=web-development/, { timeout: 10_000 });
    await expect(page.getByRole("link", { name: /Campus Connect Portal/i })).toBeVisible();
  });

  test("T009 project detail page loads published project data", async ({ page }) => {
    await page.goto(`/en/projects/${SEED_PROJECT_SLUG}`);
    await expect(page.getByRole("heading", { name: SEED_PROJECT_TITLE })).toBeVisible();
    await expect(page.getByText(/Computer Science/i)).toBeVisible();
  });

  test("T019 author info fallback shows text without embedded map", async ({ page }) => {
    await page.goto(`/en/projects/${SEED_PROJECT_SLUG}`);
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(page.getByText("Bobur Toshmatov")).toBeVisible();
  });
});

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("T020 mobile navigation keeps register visible and hides desktop nav", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeHidden();
    await expect(page.getByRole("banner").getByRole("link", { name: /^register$/i })).toBeVisible();
  });
});
