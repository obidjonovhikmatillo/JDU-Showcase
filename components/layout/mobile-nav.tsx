"use client";

import { MenuIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { LogoutButton } from "@/components/auth/logout-button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { HeaderUserMenu } from "@/components/layout/header-user-menu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  labelKey: string;
};

type MobileNavProps = {
  navItems: NavItem[];
  isAuthenticated: boolean;
  fullName?: string | null;
  avatarUrl?: string | null;
  profileHeadline?: string | null;
};

export function MobileNav({
  navItems,
  isAuthenticated,
  fullName,
  avatarUrl,
  profileHeadline,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const resolvedFullName =
    session?.user?.fullName ?? session?.user?.name ?? fullName ?? "";
  const resolvedHeadline =
    session?.user?.profileHeadline ?? profileHeadline ?? null;
  const resolvedAvatar = session?.user?.avatarUrl ?? avatarUrl ?? null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="relative lg:hidden"
        aria-label={t("openMenu")}
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="size-5" aria-hidden />
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 lg:hidden"
          aria-hidden
        />
      </Button>

      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup
          showClose={false}
          className="fixed inset-y-0 right-0 top-0 left-auto h-dvh w-[min(100%,20rem)] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 border-l border-border p-0 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
            <DialogTitle className="text-base font-semibold">
              <BrandLogo label={tCommon("brand")} />
            </DialogTitle>
            <DialogClose
              className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t("closeMenu")}
            >
              <XIcon className="size-5" aria-hidden />
              <span
                className="pointer-events-none absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2"
                aria-hidden
              />
            </DialogClose>
          </div>

          <nav className="px-3 py-4" aria-label={t("mobileNavLabel")}>
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.labelKey}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "w-full justify-start text-base/7",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Separator />

          <div className="space-y-4 px-4 py-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="space-y-3">
                {resolvedFullName ? (
                  <HeaderUserMenu
                    fullName={resolvedFullName}
                    avatarUrl={resolvedAvatar}
                    profileHeadline={resolvedHeadline}
                    showTextAlways
                    className="max-w-none px-0 hover:bg-transparent"
                  />
                ) : null}
                <LogoutButton />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
