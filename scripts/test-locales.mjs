const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const locales = ["en", "uz", "ru", "ja"];

const localeExpectations = {
  en: { home: "Discover student projects", login: "Sign in" },
  uz: { home: "Talabalar loyihalarini kashf eting", login: "Kirish" },
  ru: { home: "Откройте студенческие проекты", login: "Войти" },
  ja: { home: "学生プロジェクトを発見しよう", login: "ログイン" },
};

let failures = 0;

async function testUrl(url, checks) {
  const response = await fetch(url, { redirect: "manual" });
  const body = await response.text();

  if (response.status >= 400) {
    console.error(`FAIL ${url} -> HTTP ${response.status}`);
    failures += 1;
    return;
  }

  for (const check of checks) {
    if (!body.includes(check)) {
      console.error(`FAIL ${url} -> missing "${check}"`);
      failures += 1;
      return;
    }
  }

  console.log(`OK   ${url}`);
}

async function main() {
  const root = await fetch(baseUrl, { redirect: "manual" });
  if (root.status !== 307 && root.status !== 308) {
    console.error(`FAIL / should redirect, got ${root.status}`);
    failures += 1;
  } else {
    console.log(`OK   / redirects to ${root.headers.get("location")}`);
  }

  for (const locale of locales) {
    const expectations = localeExpectations[locale];

    await testUrl(`${baseUrl}/${locale}`, [expectations.home]);
    await testUrl(`${baseUrl}/${locale}/projects`, [expectations.home.includes("Discover") ? "Projects" : locale === "uz" ? "Loyihalar" : locale === "ru" ? "Проекты" : "プロジェクト"]);
    await testUrl(`${baseUrl}/${locale}/login`, [expectations.login]);
    await testUrl(`${baseUrl}/${locale}/register`, [
      locale === "en"
        ? "Create account"
        : locale === "uz"
          ? "Hisob yaratish"
          : locale === "ru"
            ? "Создать аккаунт"
            : "アカウント作成",
    ]);
    await testUrl(`${baseUrl}/${locale}/projects/demo-project`, ["demo-project"]);

    const profile = await fetch(`${baseUrl}/${locale}/profile`, { redirect: "manual" });
    if (profile.status !== 307 && profile.status !== 302) {
      console.error(`FAIL /${locale}/profile should redirect to login, got ${profile.status}`);
      failures += 1;
    } else if (!profile.headers.get("location")?.includes(`/${locale}/login`)) {
      console.error(`FAIL /${locale}/profile redirect -> ${profile.headers.get("location")}`);
      failures += 1;
    } else {
      console.log(`OK   /${locale}/profile redirects to login`);
    }
  }

  if (failures > 0) {
    process.exit(1);
  }

  console.log("\nAll locale page checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
