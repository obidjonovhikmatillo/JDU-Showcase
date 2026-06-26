import { expect, type Page } from "@playwright/test";

export const TEST_USERS = {
  admin: { email: "admin@example.com", password: "Admin123!" },
  user: { email: "user@example.com", password: "User123!" },
  other: { email: "aziza@example.com", password: "User123!" },
} as const;

export const SEED_PROJECT_SLUG = "campus-connect-portal";
export const SEED_PROJECT_TITLE = "Campus Connect Portal";

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

async function fillRequiredProjectFields(page: Page, title: string, slug: string) {
  await page.locator("#title").fill(title);
  await page.locator("#slug").fill(slug);
  await page.locator("#authorName").fill("Test Author");
  await page.locator("#department").fill("Computer Science");
  await page.locator("#description").fill("Automated test project description.");
  await page.getByRole("combobox").first().click();
  await page.getByRole("option").first().click();
}

export async function createAdminProject(page: Page, title: string, slug: string) {
  await page.goto("/en/admin/projects/new");
  await fillRequiredProjectFields(page, title, slug);
  await page.getByRole("button", { name: /create project/i }).click();
  await expect(page).toHaveURL(new RegExp(`${slug}/edit`), { timeout: 20_000 });
}

export { fillRequiredProjectFields };
