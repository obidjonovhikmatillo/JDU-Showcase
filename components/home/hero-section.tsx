"use client";

import { SearchIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { getCategoryLabel } from "@/lib/categories";
import type { CategoryWithCount } from "@/lib/data/project-types";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  categories: CategoryWithCount[];
  isAuthenticated?: boolean;
};

const pillColors = [
  "bg-[#0057ff]",
  "bg-[#1a1a2e]",
  "bg-[#e94560]",
  "bg-[#0f3460]",
  "bg-[#533483]",
  "bg-[#16213e]",
  "bg-[#e76f51]",
  "bg-[#2a9d8f]",
  "bg-[#264653]",
  "bg-[#6d28d9]",
];

export function HeroSection({ categories, isAuthenticated }: HeroSectionProps) {
  const t = useTranslations("Home.hero");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (trimmed) {
      router.push({ pathname: "/projects", query: { q: trimmed } });
      return;
    }

    router.push("/projects");
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 pb-10 pt-14 sm:pb-14 sm:pt-20 lg:pb-16 lg:pt-28">
      {/* Subtle decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 size-[400px] rounded-full bg-[#0057ff]/[0.04] blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-[350px] rounded-full bg-[#0057ff]/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Eyebrow */}
        <p className="mb-5 inline-block rounded-full border border-[#0057ff]/20 bg-[#0057ff]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#0057ff]">
          {t("eyebrow")}
        </p>

        {/* Main headline */}
        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {t("headline")}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("description")}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/projects"
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-full bg-[#0057ff] px-8 text-base font-semibold text-white shadow-lg shadow-[#0057ff]/25 transition-all hover:bg-[#0046cc] hover:shadow-xl hover:shadow-[#0057ff]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0057ff] focus-visible:ring-offset-2"
            )}
          >
            {t("cta")}
          </Link>
          {!isAuthenticated && (
            <Link
              href="/register"
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-full border-2 border-border bg-background px-8 text-base font-semibold text-foreground transition-all hover:border-[#0057ff]/40 hover:bg-[#0057ff]/5 hover:text-[#0057ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              {t("ctaRegister")}
            </Link>
          )}
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 max-w-2xl sm:mt-12"
          role="search"
          aria-label={t("searchAriaLabel")}
        >
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-14 rounded-full border-border/60 bg-background pl-14 pr-32 text-base shadow-md transition-shadow focus-visible:shadow-lg sm:h-[60px] sm:text-[15px]"
            />
            <Button
              type="submit"
              size="lg"
              className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-[#0057ff] px-6 text-white hover:bg-[#0046cc] sm:h-11"
            >
              {t("searchButton")}
            </Button>
          </div>
        </form>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="mt-10 sm:mt-12">
          <nav
            ref={scrollRef}
            aria-label={t("searchCategoryLabel")}
            className="scrollbar-none flex items-center gap-2.5 overflow-x-auto px-4 pb-2 sm:flex-wrap sm:justify-center sm:gap-3 sm:px-6"
          >
            {categories.map((category, index) => {
              const label = getCategoryLabel(category, locale);
              const bgColor = pillColors[index % pillColors.length];
              return (
                <Link
                  key={category.id}
                  href={{ pathname: "/projects", query: { category: category.slug } }}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all",
                    bgColor,
                    "hover:opacity-90 hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  {label}
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                    {category.projectCount}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </section>
  );
}
