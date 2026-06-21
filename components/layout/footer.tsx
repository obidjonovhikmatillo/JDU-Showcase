import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getCategoriesWithCounts } from "@/lib/data/restaurants";
import { getCategoryLabel } from "@/lib/categories";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const brand = await getTranslations("Common");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  let categories: Awaited<ReturnType<typeof getCategoriesWithCounts>> = [];

  try {
    categories = await getCategoriesWithCounts();
  } catch {
    categories = [];
  }

  const exploreLinks = [
    { href: "/", label: nav("home") },
    { href: "/restaurants", label: nav("restaurants") },
  ];

  const accountLinks = [
    { href: "/login", label: nav("login") },
    { href: "/register", label: nav("register") },
    { href: "/profile", label: nav("profile") },
  ];

  return (
    <footer className="mt-16 border-t border-border bg-muted">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
        <div className="space-y-3">
          <p className="text-base font-semibold text-foreground">{brand("brand")}</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{t("description")}</p>
          <p className="text-sm text-muted-foreground">{brand("tagline")}</p>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground">
            {t("explore")}
          </h2>
          <nav className="flex flex-col gap-3 text-sm" aria-label={t("exploreNavLabel")}>
            {exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground">
            {t("account")}
          </h2>
          <nav className="flex flex-col gap-3 text-sm" aria-label={t("accountNavLabel")}>
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground">
            {t("categories")}
          </h2>
          <nav className="flex flex-col gap-3 text-sm" aria-label={t("categoriesNavLabel")}>
            {categories.length > 0 ? (
              categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={{ pathname: "/restaurants", query: { category: category.slug } }}
                  className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {getCategoryLabel(category, locale)}
                </Link>
              ))
            ) : (
              <span className="text-muted-foreground">{t("noCategories")}</span>
            )}
          </nav>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <p className="text-center text-sm text-muted-foreground">
          © {year} {brand("brand")}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
