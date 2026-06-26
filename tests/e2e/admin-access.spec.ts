import { expect, test } from "@playwright/test";

import { login, TEST_USERS } from "../helpers/playwright-auth";

test.describe("Admin access", () => {
  test("T005 admin route is protected from guests and normal users", async ({ page }) => {
    await page.goto("/en/admin");
    await expect(page).toHaveURL(/\/en\/login/);

    await login(page, TEST_USERS.user.email, TEST_USERS.user.password);
    await page.goto("/en/admin");
    await expect(page).not.toHaveURL(/\/en\/admin$/);
  });

  test("T005 admin user can open the admin dashboard", async ({ page }) => {
    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await page.goto("/en/admin");
    await expect(page).toHaveURL(/\/en\/admin/);
    await expect(page.getByRole("link", { name: /projects/i })).toBeVisible();
  });
});
