"use client";

import {
  FolderTreeIcon,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const links: Array<{
  href: "/admin" | "/admin/restaurants" | "/admin/categories" | "/admin/reviews" | "/admin/users";
  labelKey: "dashboard" | "restaurants" | "categories" | "reviews" | "users";
  icon: typeof LayoutDashboardIcon;
  exact?: boolean;
}> = [
  { href: "/admin", labelKey: "dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/restaurants", labelKey: "restaurants", icon: StoreIcon },
  { href: "/admin/categories", labelKey: "categories", icon: FolderTreeIcon },
  { href: "/admin/reviews", labelKey: "reviews", icon: MessageSquareTextIcon },
  { href: "/admin/users", labelKey: "users", icon: UsersIcon },
];

export function AdminNav() {
  const pathname = usePathname();
  const t = useTranslations("AdminNav");

  return (
    <nav
      aria-label={t("label")}
      className="rounded-xl border border-border/60 bg-card p-3 lg:w-56 lg:shrink-0"
    >
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {links.map(({ href, labelKey, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);

          return (
            <li key={href} className="shrink-0 lg:shrink">
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {t(labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
