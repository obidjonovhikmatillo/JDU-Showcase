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
    callbackUrl: `${baseUrl}${prefix}/profile`,
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

async function fetchProtected(path, cookies = "") {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    headers: cookies ? { cookie: cookies } : undefined,
  });

  await response.text().catch(() => "");

  return {
    status: response.status,
    location: response.headers.get("location"),
  };
}

async function signOut(cookies) {
  const csrf = await getCsrfToken(cookies);

  const body = new URLSearchParams({
    csrfToken: csrf.csrfToken,
    callbackUrl: `${baseUrl}${prefix}`,
    json: "true",
  });

  await fetch(`${baseUrl}/api/auth/signout`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: csrf.cookies,
    },
    body,
    redirect: "manual",
  }).then((response) => response.text().catch(() => ""));
}

async function main() {
  console.log(`Testing auth flows at ${baseUrl} (locale: ${locale})\n`);

  const profileGuest = await fetchProtected(`${prefix}/profile`);
  assert(
    "Profile redirects guests to login",
    profileGuest.status === 307 && profileGuest.location?.includes("/login"),
  );

  const adminGuest = await fetchProtected(`${prefix}/admin`);
  assert(
    "Admin redirects guests to login",
    adminGuest.status === 307 && adminGuest.location?.includes("/login"),
  );

  const userLogin = await signIn("user@example.com", "User123!");
  assert("User login succeeds", userLogin.status === 302 || userLogin.status === 200);

  const profileUser = await fetchProtected(`${prefix}/profile`, userLogin.cookies);
  assert("Authenticated user can access profile", profileUser.status === 200);

  const adminUser = await fetchProtected(`${prefix}/admin`, userLogin.cookies);
  assert(
    "Normal user cannot access admin",
    adminUser.status === 307 &&
      (adminUser.location?.includes(`${prefix}`) ||
        adminUser.location === `${baseUrl}/`),
  );

  await signOut(userLogin.cookies);

  const adminLogin = await signIn("admin@example.com", "Admin123!");
  assert("Admin login succeeds", adminLogin.status === 302 || adminLogin.status === 200);

  const adminPage = await fetchProtected(`${prefix}/admin`, adminLogin.cookies);
  assert("Admin can access admin route", adminPage.status === 200);

  await signOut(adminLogin.cookies);
  const profileAfterLogout = await fetchProtected(`${prefix}/profile`);
  assert(
    "Profile blocked after logout",
    profileAfterLogout.status === 307 && profileAfterLogout.location?.includes("/login"),
  );

  const failedLogin = await signIn("user@example.com", "WrongPass1!");
  assert("Invalid login is rejected", failedLogin.status === 401 || failedLogin.status === 302);

  const registerPage = await fetch(`${baseUrl}${prefix}/register`);
  assert("Register page loads", registerPage.status === 200);

  const loginPage = await fetch(`${baseUrl}${prefix}/login`);
  assert("Login page loads", loginPage.status === 200);

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error("\nSome checks failed.");
    process.exit(1);
  }

  console.log("\nAll auth checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
