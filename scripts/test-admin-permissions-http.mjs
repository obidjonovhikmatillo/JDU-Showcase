const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
const locale = process.env.TEST_LOCALE ?? "en";
const prefix = `/${locale}`;

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
    callbackUrl: `${baseUrl}${prefix}/admin`,
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

async function fetchAdmin(cookies = "", redirect = "follow") {
  const response = await fetch(`${baseUrl}${prefix}/admin`, {
    headers: cookies ? { cookie: cookies } : undefined,
    redirect,
  });

  const html = await response.text();

  return {
    status: response.status,
    url: response.url,
    html,
  };
}

async function main() {
  console.log(`Testing admin routes at ${baseUrl} (locale: ${locale})\n`);

  const guestResponse = await fetchAdmin("", "manual");
  assert(
    "Guest is redirected away from admin",
    guestResponse.status === 307 ||
      guestResponse.status === 302 ||
      guestResponse.url.includes("/login"),
  );

  const userLogin = await signIn("user@example.com", "User123!");
  assert("Regular user login succeeds", userLogin.status === 302 || userLogin.status === 200);

  const userAdmin = await fetchAdmin(userLogin.cookies, "manual");
  assert(
    "Regular user cannot access admin panel",
    userAdmin.status === 307 ||
      userAdmin.status === 302 ||
      !userAdmin.url.endsWith(`${prefix}/admin`),
  );

  const adminLogin = await signIn("admin@example.com", "Admin123!");
  assert("Admin login succeeds", adminLogin.status === 302 || adminLogin.status === 200);

  const adminPage = await fetchAdmin(adminLogin.cookies);
  assert("Admin can access admin panel", adminPage.status === 200);
  assert(
    "Admin dashboard shows navigation",
    adminPage.html.includes("Restaurants") || adminPage.html.includes("restaurants"),
  );
  assert(
    "Admin dashboard shows statistics",
    adminPage.html.includes("Total restaurants") ||
      adminPage.html.includes("totalRestaurants") ||
      adminPage.html.includes("reviews"),
  );

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error("\nSome admin HTTP checks failed.");
    process.exit(1);
  }

  console.log("\nAll admin HTTP checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
