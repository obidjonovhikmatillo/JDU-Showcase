import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getCategoriesWithCounts } from "@/lib/data/projects";
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
    { href: "/projects", label: nav("projects") },
  ];

  const accountLinks = [
    { href: "/login", label: nav("login") },
    { href: "/register", label: nav("register") },
    { href: "/profile", label: nav("profile") },
  ];

  return (
    <footer className="mt-16 bg-[#0d0d12]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
        {/* Brand column */}
        <div className="space-y-4">
          <p className="text-lg font-bold tracking-tight text-white">{brand("brand")}</p>
          <p className="max-w-sm text-sm leading-relaxed text-white/50">{t("description")}</p>
          <p className="text-sm text-white/40">{brand("tagline")}</p>
        </div>

        {/* Explore column */}
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
            {t("explore")}
          </h2>
          <nav className="flex flex-col gap-3 text-sm" aria-label={t("exploreNavLabel")}>
            {exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/50 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Account column */}
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
            {t("account")}
          </h2>
          <nav className="flex flex-col gap-3 text-sm" aria-label={t("accountNavLabel")}>
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/50 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Categories column */}
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
            {t("categories")}
          </h2>
          <nav className="flex flex-col gap-3 text-sm" aria-label={t("categoriesNavLabel")}>
            {categories.length > 0 ? (
              categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={{ pathname: "/projects", query: { category: category.slug } }}
                  className="text-white/50 transition-colors hover:text-white"
                >
                  {getCategoryLabel(category, locale)}
                </Link>
              ))
            ) : (
              <span className="text-white/40">{t("noCategories")}</span>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <p className="text-center text-sm text-white/40">
          &copy; {year} {brand("brand")}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
