const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const locale = process.env.TEST_LOCALE ?? "en";
const prefix = `/${locale}`;
const projectSlug = process.env.TEST_PROJECT_SLUG ?? "campus-connect-portal";

const checks = [];

function assert(name, condition) {
  checks.push({ name, ok: Boolean(condition) });
  console.log(`${condition ? "PASS" : "FAIL"} - ${name}`);
}

function mergeCookies(existing, setCookieHeaders) {
  const jar = new Map();

  for (const part of existing.split(";").map((value) => value.trim()).filter(Boolean)) {
    const [name, ...rest] = part.split("=");
    jar.set(name, rest.join("="));
  }

  for (const header of setCookieHeaders) {
    const [pair] = header.split(";");
    const [name, ...rest] = pair.split("=");
    jar.set(name, rest.join("="));
  }

  return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
}

async function getCsrfToken(cookieHeader = "") {
  const response = await fetch(`${baseUrl}/api/auth/csrf`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  const setCookie = response.headers.getSetCookie?.() ?? [];
  const data = await response.json();

  return {
    csrfToken: data.csrfToken,
    cookies: mergeCookies(cookieHeader, setCookie),
  };
}

async function signIn(email, password) {
  const csrf = await getCsrfToken();

  const body = new URLSearchParams({
    csrfToken: csrf.csrfToken,
    email,
    password,
    callbackUrl: `${baseUrl}${prefix}/projects/${projectSlug}`,
    json: "true",
  });

  const response = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: csrf.cookies,
    },
    body,
    redirect: "manual",
  });

  await response.text().catch(() => "");

  const setCookie = response.headers.getSetCookie?.() ?? [];

  return {
    status: response.status,
    cookies: mergeCookies(csrf.cookies, setCookie),
  };
}

async function fetchPage(path, cookies = "") {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: cookies ? { cookie: cookies } : undefined,
  });

  const html = await response.text();

  return {
    status: response.status,
    html,
  };
}

async function main() {
  console.log(`Testing comment pages at ${baseUrl} (locale: ${locale})\n`);

  const guestPage = await fetchPage(`${prefix}/projects/${projectSlug}`);
  assert("Guest can view project detail page", guestPage.status === 200);
  assert(
    "Guest sees sign-in prompt instead of comment form",
    guestPage.html.includes("Sign in to write a comment") ||
      guestPage.html.includes("Log in to continue"),
  );
  assert(
    "Guest page does not expose comment form fields",
    !guestPage.html.includes('id="comment-title"') &&
      !guestPage.html.includes('id="comment-content"'),
  );

  const login = await signIn("user@example.com", "User123!");
  assert("User login succeeds", login.status === 302 || login.status === 200);

  const authedPage = await fetchPage(
    `${prefix}/projects/${projectSlug}`,
    login.cookies,
  );
  assert("Authenticated user can view project detail page", authedPage.status === 200);
  assert(
    "Authenticated user sees comment form",
    authedPage.html.includes("Write a comment") &&
      authedPage.html.includes("Submit comment"),
  );

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error("\nSome HTTP checks failed.");
    process.exit(1);
  }

  console.log("\nAll comment HTTP checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
