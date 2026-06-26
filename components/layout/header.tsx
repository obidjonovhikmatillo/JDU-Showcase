import { PlusIcon } from "lucide-react";
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
    { href: "/projects", labelKey: "projects" },
    { href: "/profile", labelKey: "profile" },
  ];

  if (isAdmin) {
    items.push({ href: "/admin", labelKey: "admin" });
  }

  return items;
}

export async function Header() {
  const t = await getTranslations("Nav");
  const tUpload = await getTranslations("Upload");
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
    <header className="behance-header sticky top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-2.5 sm:px-8 lg:gap-6">
        {/* Logo */}
        <Link
          href="/"
          aria-label={brand("brand")}
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <BrandLogo label={brand("brand")} showLabel className="hidden sm:inline-flex" />
          <BrandLogo label={brand("brand")} showLabel={false} className="sm:hidden" />
        </Link>

        {/* Nav Links */}
        <HeaderNavLinks
          items={navItems}
          className="ml-8 hidden shrink-0 lg:flex"
        />

        {/* Search Bar */}
        <HeaderSearchBar
          compact
          className="mx-4 hidden min-w-0 max-w-[16rem] flex-1 lg:flex xl:max-w-[20rem]"
        />

        {/* Right side controls */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
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

          {isAuthenticated && (
            <Link
              href="/upload"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden rounded-full bg-foreground px-3.5 font-medium text-background shadow-none hover:bg-foreground/90 lg:inline-flex",
              )}
            >
              <PlusIcon className="mr-1 size-4" aria-hidden />
              {tUpload("uploadButton")}
            </Link>
          )}

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <LogoutButton compact />
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "rounded-full border border-white/30 px-4 font-medium text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "rounded-full bg-[#0057ff] px-4 font-medium text-white shadow-none hover:bg-[#0046cc]",
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

      {/* Mobile search row */}
      <div className="border-t border-white/10 px-4 pb-3 sm:px-6 lg:hidden">
        <HeaderSearchBar compact className="pt-3" />
      </div>
    </header>
  );
}
