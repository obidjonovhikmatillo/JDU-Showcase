import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { HeaderNavLinks, type HeaderNavItemConfig } from "@/components/layout/header-nav-links";
import { HeaderSearchBar } from "@/components/layout/header-search-bar";
import { HeaderUserMenu } from "@/components/layout/header-user-menu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function buildNavItems(isAdmin: boolean): HeaderNavItemConfig[] {
  const items: HeaderNavItemConfig[] = [
    { href: "/", labelKey: "home", exact: true },
    { href: "/restaurants", labelKey: "postReview" },
    { href: "/profile", labelKey: "profile" },
  ];

  if (isAdmin) {
    items.push({ href: "/admin", labelKey: "admin" });
  }

  return items;
}

export async function Header() {
  const t = await getTranslations("Nav");
  const brand = await getTranslations("Common");
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.id);
  const isAdmin = session?.user?.role === "ADMIN";

  const navItems = buildNavItems(isAdmin);

  const mobileNavItems = navItems.map((item) => ({
    href: item.href,
    label: t(item.labelKey),
    labelKey: item.labelKey,
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1280px] items-center gap-2 px-4 py-2.5 sm:px-6 lg:gap-3 lg:py-3">
        <Link
          href="/"
          aria-label={brand("brand")}
          className="shrink-0 transition-opacity hover:opacity-90"
        >
          <BrandLogo label={brand("brand")} showLabel className="hidden sm:inline-flex" />
          <BrandLogo label={brand("brand")} showLabel={false} className="sm:hidden" />
        </Link>

        <HeaderNavLinks
          items={navItems}
          className="ml-4 hidden shrink-0 lg:ml-10 lg:flex xl:ml-12"
        />

        <HeaderSearchBar
          compact
          className="mx-2 hidden min-w-0 max-w-[11rem] flex-1 lg:flex xl:max-w-[14rem]"
        />

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {isAuthenticated ? (
            <HeaderUserMenu
              fullName={session?.user.fullName ?? ""}
              avatarUrl={session?.user.avatarUrl}
              profileHeadline={session?.user.profileHeadline}
              className="hidden lg:flex"
            />
          ) : null}

          <div className="hidden items-center gap-1.5 lg:flex">
            {isAuthenticated ? (
              <LogoutButton compact />
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "rounded-full px-3.5 font-medium",
                  )}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-full border-border px-3.5 font-medium shadow-none hover:bg-muted",
                  )}
                >
                  {t("register")}
                </Link>
              </>
            )}
          </div>

          <MobileNav
            navItems={mobileNavItems}
            isAuthenticated={isAuthenticated}
            fullName={session?.user?.fullName}
            avatarUrl={session?.user?.avatarUrl}
            profileHeadline={session?.user?.profileHeadline}
          />
        </div>
      </div>

      <div className="border-t border-border px-4 pb-2.5 sm:px-6 lg:hidden">
        <HeaderSearchBar compact className="pt-2.5" />
      </div>
    </header>
  );
}
