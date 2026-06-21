"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { Link } from "@/i18n/navigation";
import { initialsFromName, splitDisplayName } from "@/lib/display-name";
import { normalizeImageSrcForDisplay } from "@/lib/uploads/uploaded-image-url";
import { cn } from "@/lib/utils";

type HeaderUserMenuProps = {
  fullName: string;
  avatarUrl?: string | null;
  profileHeadline?: string | null;
  className?: string;
  showTextAlways?: boolean;
};

export function HeaderUserMenu({
  fullName,
  avatarUrl,
  profileHeadline,
  className,
  showTextAlways = false,
}: HeaderUserMenuProps) {
  const t = useTranslations("Nav");
  const { data: session } = useSession();
  const resolvedFullName =
    session?.user?.fullName ?? session?.user?.name ?? fullName;
  const resolvedHeadline =
    session?.user?.profileHeadline ?? profileHeadline ?? null;
  const resolvedAvatar = session?.user?.avatarUrl ?? avatarUrl ?? null;
  const { primary, secondary } = splitDisplayName(
    resolvedFullName,
    resolvedHeadline,
  );
  const displayAvatar = resolvedAvatar
    ? normalizeImageSrcForDisplay(resolvedAvatar)
    : null;
  const initials = initialsFromName(resolvedFullName);

  return (
    <Link
      href="/profile"
      className={cn(
        "flex max-w-[9.5rem] items-center gap-2.5 rounded-full py-1 pr-1 pl-1 transition-colors hover:bg-muted xl:max-w-[11rem]",
        className,
      )}
      aria-label={t("profile")}
    >
      <span className="relative flex size-9 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
        {displayAvatar ? (
          <Image
            src={displayAvatar}
            alt={t("profileAvatarAlt", { name: resolvedFullName })}
            fill
            sizes="36px"
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
            {initials || "?"}
          </span>
        )}
      </span>
      <span className={cn("hidden min-w-0 flex-col leading-tight", showTextAlways ? "flex" : "xl:flex")}>
        <span className="truncate text-sm text-foreground">{primary}</span>
        {secondary ? (
          <span className="truncate text-xs text-muted-foreground">{secondary}</span>
        ) : (
          <span className="truncate text-xs text-muted-foreground">{t("addHeadlineHint")}</span>
        )}
      </span>
    </Link>
  );
}
