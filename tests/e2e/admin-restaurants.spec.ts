import { expect, test } from "@playwright/test";

import {
  createAdminProject,
  login,
  TEST_USERS,
  uniqueSlug,
} from "../helpers/playwright-auth";

test.describe("Admin project management", () => {
  test("T014 admin can create a project", async ({ page }) => {
    const slug = uniqueSlug("e2e-project");
    const title = `E2E Project ${Date.now()}`;

    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await createAdminProject(page, title, slug);
  });

  test("T015 admin can edit a project", async ({ page }) => {
    const slug = uniqueSlug("e2e-edit");
    const updatedTitle = `Edited ${Date.now()}`;

    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await createAdminProject(page, `Create ${slug}`, slug);
    await page.locator("#title").fill(updatedTitle);
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 10_000 });
  });

  test("T016 admin can delete a project", async ({ page }) => {
    const slug = uniqueSlug("e2e-delete");
    const title = `Delete ${Date.now()}`;

    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await createAdminProject(page, title, slug);
    await page.goto("/en/admin/projects");
    await page.locator("#admin-search-q").fill(slug);
    await page.getByRole("button", { name: /apply filters/i }).click();
    await page.getByRole("button", { name: /^delete$/i }).click();
    await page.getByRole("button", { name: /delete project/i }).click();
    await expect(page.getByText(title)).toHaveCount(0, { timeout: 15_000 });
  });
});
