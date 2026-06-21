import { expect, test } from "@playwright/test";

import {
  createAdminRestaurant,
  login,
  TEST_USERS,
  uniqueSlug,
} from "../helpers/playwright-auth";

test.describe("Admin restaurant management", () => {
  test("T014 admin can create a restaurant", async ({ page }) => {
    const slug = uniqueSlug("e2e-restaurant");
    const name = `E2E Restaurant ${Date.now()}`;

    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await createAdminRestaurant(page, name, slug);
  });

  test("T015 admin can edit a restaurant", async ({ page }) => {
    const slug = uniqueSlug("e2e-edit");
    const updatedName = `Edited ${Date.now()}`;

    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await createAdminRestaurant(page, `Create ${slug}`, slug);
    await page.locator("#name").fill(updatedName);
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page.getByText(updatedName)).toBeVisible({ timeout: 10_000 });
  });

  test("T016 admin can delete a restaurant", async ({ page }) => {
    const slug = uniqueSlug("e2e-delete");
    const name = `Delete ${Date.now()}`;

    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await createAdminRestaurant(page, name, slug);
    await page.goto("/en/admin/restaurants");
    await page.locator("#admin-search-q").fill(slug);
    await page.getByRole("button", { name: /apply filters/i }).click();
    await page.getByRole("button", { name: /^delete$/i }).click();
    await page.getByRole("button", { name: /delete restaurant/i }).click();
    await expect(page.getByText(name)).toHaveCount(0, { timeout: 15_000 });
  });
});
