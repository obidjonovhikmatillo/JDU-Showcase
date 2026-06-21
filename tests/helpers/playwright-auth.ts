import { expect, type Page } from "@playwright/test";

export const TEST_USERS = {
  admin: { email: "admin@example.com", password: "Admin123!" },
  user: { email: "user@example.com", password: "User123!" },
  other: { email: "aziza@example.com", password: "User123!" },
} as const;

export const SEED_RESTAURANT_SLUG = "trattoria-amici";
export const SEED_RESTAURANT_NAME = "Trattoria Amici";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export async function loginViaApi(
  page: Page,
  email: string,
  password: string,
  locale = "en",
) {
  const csrfResponse = await page.request.get(`${baseURL}/api/auth/csrf`);
  expect(csrfResponse.ok()).toBeTruthy();
  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const loginResponse = await page.request.post(
    `${baseURL}/api/auth/callback/credentials`,
    {
      form: {
        csrfToken,
        email,
        password,
        callbackUrl: `${baseURL}/${locale}/profile`,
        json: "true",
      },
    },
  );

  expect(loginResponse.ok() || loginResponse.status() === 302).toBeTruthy();
  await page.goto(`/${locale}/profile`);
  await expect(page).toHaveURL(new RegExp(`/${locale}/profile`));
}

export async function loginViaUi(
  page: Page,
  email: string,
  password: string,
  locale = "en",
) {
  await page.goto(`/${locale}/login`, { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: /^email$/i }).fill(email);
  await page.getByRole("textbox", { name: /^password$/i }).fill(password);

  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/callback/credentials") &&
        response.request().method() === "POST",
    ),
    page.getByRole("button", { name: /sign in/i }).click(),
  ]);

  await expect(page).toHaveURL(new RegExp(`/${locale}/(profile|admin)`), {
    timeout: 20_000,
  });
}

export async function login(
  page: Page,
  email: string,
  password: string,
  locale = "en",
) {
  await loginViaApi(page, email, password, locale);
}

export async function logout(page: Page) {
  const signOutButton = page.getByRole("button", { name: /sign out|chiqish|выйти|ログアウト/i });
  await signOutButton.click();
  await expect(page).toHaveURL(/\/(en|uz|ru|ja)\/?$/, { timeout: 10_000 });
}

export function uniqueSlug(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

async function fillRequiredRestaurantFields(page: Page, name: string, slug: string) {
  await page.locator("#name").fill(name);
  await page.locator("#slug").fill(slug);
  await page.locator("#city").fill("Tashkent");
  await page.locator("#address").fill("1 Test Street");
  await page.locator("#latitude").fill("41.31");
  await page.locator("#longitude").fill("69.24");
  await page.locator("#description").fill("Automated test restaurant description.");
  await page.getByRole("combobox").first().click();
  await page.getByRole("option").first().click();
}

export async function createAdminRestaurant(page: Page, name: string, slug: string) {
  await page.goto("/en/admin/restaurants/new");
  await fillRequiredRestaurantFields(page, name, slug);
  await page.getByRole("button", { name: /create restaurant/i }).click();
  await expect(page).toHaveURL(new RegExp(`${slug}/edit`), { timeout: 20_000 });
}

export { fillRequiredRestaurantFields };
