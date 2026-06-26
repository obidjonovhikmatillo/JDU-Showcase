import { expect, test } from "@playwright/test";

test.describe("Locale switching", () => {
  test("T006 language switcher changes the URL locale", async ({ page }) => {
    await page.goto("/en/projects", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /change language/i }).click();
    await page
      .locator('[data-slot="dropdown-menu-content"] [data-slot="dropdown-menu-radio-item"]')
      .filter({ hasText: /zbek/i })
      .click();
    await expect(page).toHaveURL(/\/uz\/projects/, { timeout: 10_000 });
  });
});
