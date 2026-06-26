import { expect, test } from "@playwright/test";

import { login, SEED_PROJECT_SLUG, TEST_USERS } from "../helpers/playwright-auth";

test.describe("Comments", () => {
  test("T010 authenticated user can create a comment", async ({ page }) => {
    const title = `E2E Comment ${Date.now()}`;

    await login(page, TEST_USERS.user.email, TEST_USERS.user.password);
    await page.goto(`/en/projects/${SEED_PROJECT_SLUG}`);
    await page.locator("#comment-title").fill(title);
    await page.locator("#comment-content").fill("Automated comment created by Playwright.");
    await page.getByRole("radio", { name: "5 stars" }).click();
    await page.getByRole("button", { name: /submit comment/i }).click();

    await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 15_000 });
  });

  test("T011 authenticated user can edit their comment", async ({ page }) => {
    const updatedTitle = `Edited ${Date.now()}`;

    await login(page, TEST_USERS.user.email, TEST_USERS.user.password);
    await page.goto(`/en/projects/${SEED_PROJECT_SLUG}`);
    await page.getByRole("button", { name: /^edit$/i }).first().click();
    await page.locator('[id^="edit-title-"]').fill(updatedTitle);
    await page.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible({ timeout: 15_000 });
  });

  test("T012 authenticated user can delete their comment", async ({ page }) => {
    const title = `Delete Me ${Date.now()}`;

    await login(page, TEST_USERS.user.email, TEST_USERS.user.password);
    await page.goto(`/en/projects/${SEED_PROJECT_SLUG}`);
    await page.locator("#comment-title").fill(title);
    await page.locator("#comment-content").fill("Temporary comment for deletion test.");
    await page.getByRole("radio", { name: "4 stars" }).click();
    await page.getByRole("button", { name: /submit comment/i }).click();
    await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 15_000 });

    const commentCard = page.locator("div").filter({ has: page.getByRole("heading", { name: title }) });
    await commentCard.getByRole("button", { name: /^delete$/i }).click();
    await page.getByRole("button", { name: /delete comment/i }).click();

    await expect(page.getByRole("heading", { name: title })).toHaveCount(0, { timeout: 15_000 });
  });

  test("T013 other users cannot edit someone else's comment", async ({ page }) => {
    await login(page, TEST_USERS.other.email, TEST_USERS.other.password);
    await page.goto(`/en/projects/${SEED_PROJECT_SLUG}`);

    const otherUserComment = page
      .locator("article, div")
      .filter({ has: page.getByRole("heading", { name: "Excellent campus tool" }) });
    await expect(otherUserComment.getByRole("button", { name: /^edit$/i })).toHaveCount(0);
  });
});
