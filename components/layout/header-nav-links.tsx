"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type HeaderNavItemConfig = {
  href: string;
  labelKey: "home" | "postReview" | "projects" | "profile" | "login" | "admin";
  exact?: boolean;
  highlight?: boolean;
};

type HeaderNavLinksProps = {
  items: HeaderNavItemConfig[];
  className?: string;
};

export function HeaderNavLinks({ items, className }: HeaderNavLinksProps) {
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <nav aria-label={t("mainNavLabel")} className={cn("flex items-center gap-1", className)}>
      {items.map((item) => {
        const isActive =
          item.highlight !== false &&
          (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.labelKey}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white",
              isActive && "text-white",
            )}
          >
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
