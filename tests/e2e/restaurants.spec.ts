import { expect, test } from "@playwright/test";

import { SEED_RESTAURANT_NAME, SEED_RESTAURANT_SLUG } from "../helpers/playwright-auth";

test.describe("Restaurant discovery", () => {
  test("T007 restaurant search finds matching restaurants", async ({ page }) => {
    await page.goto("/en/restaurants", { waitUntil: "networkidle" });
    const searchInput = page.getByRole("searchbox", {
      name: /search by name, address, city, cuisine/i,
    });
    await searchInput.fill("Trattoria");
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/q=Trattoria/i, { timeout: 10_000 });
    await expect(page.getByRole("link", { name: /Trattoria Amici/i })).toBeVisible();
  });

  test("T008 restaurant filtering applies category filters", async ({ page }) => {
    await page.goto("/en/restaurants", { waitUntil: "networkidle" });
    await page.getByRole("combobox", { name: /^category$/i }).selectOption("european-cuisine");
    await expect(page).toHaveURL(/category=european-cuisine/, { timeout: 10_000 });
    await expect(page.getByRole("link", { name: /Trattoria Amici/i })).toBeVisible();
  });

  test("T009 restaurant detail page loads published restaurant data", async ({ page }) => {
    await page.goto(`/en/restaurants/${SEED_RESTAURANT_SLUG}`);
    await expect(page.getByRole("heading", { name: SEED_RESTAURANT_NAME })).toBeVisible();
    await expect(page.getByText(/tashkent/i)).toBeVisible();
  });

  test("T019 map rendering fallback shows address text without embedded map", async ({ page }) => {
    await page.goto(`/en/restaurants/${SEED_RESTAURANT_SLUG}`);
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(page.getByText("5 Sayilgoh Street, Tashkent")).toBeVisible();
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
