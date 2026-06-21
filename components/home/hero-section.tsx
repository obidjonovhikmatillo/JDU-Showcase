"use client";

import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { FALLBACK_HERO_IMAGE } from "@/lib/restaurant-images";

export function HeroSection() {
  const t = useTranslations("Home.hero");
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (trimmed) {
      router.push({ pathname: "/restaurants", query: { q: trimmed } });
      return;
    }

    router.push("/restaurants");
  }

  return (
    <section className="relative overflow-hidden rounded-none border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-orange-500/5 lg:rounded-2xl lg:border">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-0">
        <div className="flex flex-col justify-center px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
            {t("headline")}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("description")}
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            role="search"
            aria-label={t("searchAriaLabel")}
          >
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-11 bg-background/90 pl-10"
              />
            </div>
            <Button type="submit" size="lg" className="h-11 shrink-0">
              {t("searchButton")}
            </Button>
          </form>

          <div className="mt-6">
            <Link href="/restaurants" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              {t("cta")}
            </Link>
          </div>
        </div>

        <div className="relative min-h-64 lg:min-h-[28rem]">
          <Image
            src={FALLBACK_HERO_IMAGE}
            alt={t("imageAlt")}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover lg:rounded-r-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:bg-gradient-to-l lg:from-background/20 lg:via-transparent lg:to-transparent" />
        </div>
      </div>
    </section>
  );
}
