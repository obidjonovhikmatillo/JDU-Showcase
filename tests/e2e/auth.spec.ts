import { expect, test } from "@playwright/test";

import { loginViaUi, logout, TEST_USERS } from "../helpers/playwright-auth";

test.describe("Authentication", () => {
  test("T001 registration creates a new account", async ({ page }) => {
    const email = `e2e-register-${Date.now()}@example.com`;

    await page.goto("/en/register", { waitUntil: "networkidle" });
    await page.getByRole("textbox", { name: /^full name$/i }).fill("E2E Register User");
    await page.getByRole("textbox", { name: /^email$/i }).fill(email);
    await page.getByRole("textbox", { name: /^password$/i }).fill("Test1234!");
    await page.getByRole("textbox", { name: /^confirm password$/i }).fill("Test1234!");
    await page.getByRole("combobox", { name: /preferred language/i }).selectOption("EN");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page).toHaveURL(/\/en\/profile/, { timeout: 20_000 });
    await expect(page.getByText("E2E Register User")).toBeVisible();
  });

  test("T002 login allows access with valid credentials", async ({ page }) => {
    await loginViaUi(page, TEST_USERS.user.email, TEST_USERS.user.password);
    await expect(page).toHaveURL(/\/en\/profile/);
    await expect(page.getByRole("heading", { name: /your profile/i })).toBeVisible();
  });

  test("T003 logout ends the authenticated session", async ({ page }) => {
    await loginViaUi(page, TEST_USERS.user.email, TEST_USERS.user.password);
    await logout(page);
    await page.goto("/en/profile");
    await expect(page).toHaveURL(/\/en\/login/);
  });

  test("T004 profile route is protected from guests", async ({ page }) => {
    await page.goto("/en/profile");
    await expect(page).toHaveURL(/\/en\/login\?callbackUrl=/);
  });
});
