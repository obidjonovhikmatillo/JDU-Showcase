import { expect, test } from "@playwright/test";

import { login, SEED_RESTAURANT_SLUG, TEST_USERS } from "../helpers/playwright-auth";

test.describe("Reviews", () => {
  test("T010 authenticated user can create a review", async ({ page }) => {
    const title = `E2E Review ${Date.now()}`;

    await login(page, TEST_USERS.user.email, TEST_USERS.user.password);
    await page.goto(`/en/restaurants/${SEED_RESTAURANT_SLUG}`);
    await page.locator("#review-title").fill(title);
    await page.locator("#review-content").fill("Automated review created by Playwright.");
    await page.locator("#review-visit-date").fill("2024-06-01");
    await page.getByRole("radio", { name: "5 stars" }).click();
    await page.getByRole("button", { name: /submit review/i }).click();

    await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 15_000 });
  });

  test("T011 authenticated user can edit their review", async ({ page }) => {
    const updatedTitle = `Edited ${Date.now()}`;

    await login(page, TEST_USERS.user.email, TEST_USERS.user.password);
    await page.goto(`/en/restaurants/${SEED_RESTAURANT_SLUG}`);
    await page.getByRole("button", { name: /^edit$/i }).first().click();
    await page.locator('[id^="edit-title-"]').fill(updatedTitle);
    await page.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible({ timeout: 15_000 });
  });

  test("T012 authenticated user can delete their review", async ({ page }) => {
    const title = `Delete Me ${Date.now()}`;

    await login(page, TEST_USERS.user.email, TEST_USERS.user.password);
    await page.goto(`/en/restaurants/${SEED_RESTAURANT_SLUG}`);
    await page.locator("#review-title").fill(title);
    await page.locator("#review-content").fill("Temporary review for deletion test.");
    await page.locator("#review-visit-date").fill("2024-05-01");
    await page.getByRole("radio", { name: "4 stars" }).click();
    await page.getByRole("button", { name: /submit review/i }).click();
    await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 15_000 });

    const reviewCard = page.locator("div").filter({ has: page.getByRole("heading", { name: title }) });
    await reviewCard.getByRole("button", { name: /^delete$/i }).click();
    await page.getByRole("button", { name: /delete review/i }).click();

    await expect(page.getByRole("heading", { name: title })).toHaveCount(0, { timeout: 15_000 });
  });

  test("T013 other users cannot edit someone else's review", async ({ page }) => {
    await login(page, TEST_USERS.other.email, TEST_USERS.other.password);
    await page.goto(`/en/restaurants/${SEED_RESTAURANT_SLUG}`);

    const otherUserReview = page
      .locator("article, div")
      .filter({ has: page.getByRole("heading", { name: "Excellent pasta" }) });
    await expect(otherUserReview.getByRole("button", { name: /^edit$/i })).toHaveCount(0);
  });
});
