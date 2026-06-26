"use client";

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type HeaderSearchBarProps = {
  className?: string;
  compact?: boolean;
};

export function HeaderSearchBar({ className, compact = false }: HeaderSearchBarProps) {
  const t = useTranslations("Home.hero");
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed
        ? { pathname: "/projects", query: { q: trimmed } }
        : "/projects",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label={t("searchAriaLabel")}
      className={cn("flex items-center", compact ? "gap-1.5" : "w-full gap-2", className)}
    >
      <div className="relative min-w-0 flex-1">
        <SearchIcon
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-white/40",
            compact ? "left-2.5 size-3.5" : "left-3 size-4",
          )}
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className={cn(
            "w-full rounded-full border border-white/10 bg-white/10 text-white outline-none placeholder:text-white/40 focus-visible:border-white/30 focus-visible:bg-white/15",
            compact
              ? "h-9 py-1.5 pr-3 pl-8 text-xs"
              : "h-10 py-2 pr-4 pl-10 text-sm",
          )}
        />
      </div>
      {!compact ? (
        <button
          type="submit"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ea4c89] text-white transition hover:bg-[#e31c5f]"
          aria-label={t("searchButton")}
        >
          <SearchIcon className="size-4" aria-hidden />
        </button>
      ) : null}
    </form>
  );
}
