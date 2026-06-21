"use client";

import { SearchIcon, SlidersHorizontal, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { PageHeader } from "@/components/layout/page-header";
import {
  RestaurantCard,
  RestaurantCardSkeleton,
  ViewToggle,
} from "@/components/restaurants/restaurant-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { getCategoryLabel } from "@/lib/categories";
import { formatPriceRange } from "@/lib/format-price";
import type { CategoryWithCount } from "@/lib/data/restaurant-types";
import {
  buildDiscoveryQuery,
  type DiscoveryFilters,
} from "@/lib/restaurants/discovery-params";
import type { DiscoveryResult } from "@/lib/restaurants/discovery-types";
import type { ViewMode } from "@/lib/restaurants/discovery-params";
import { cn } from "@/lib/utils";

type RestaurantDiscoveryProps = {
  result: DiscoveryResult;
  categories: CategoryWithCount[];
  cities: string[];
  title: string;
  subtitle: string;
  filtersKey: string;
};

function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {children}
      </select>
    </div>
  );
}

export function RestaurantDiscovery({
  result,
  categories,
  cities,
  title,
  subtitle,
  filtersKey,
}: RestaurantDiscoveryProps) {
  const t = useTranslations("Restaurants");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { filters, items, total, hasMore } = result;

  const [searchValue, setSearchValue] = useState(filters.query ?? "");
  const [showFilters, setShowFilters] = useState(false);

  function navigate(next: Partial<DiscoveryFilters>, resetPage = true) {
    const merged = {
      ...filters,
      ...next,
      page: resetPage ? 1 : (next.page ?? filters.page),
    };

    startTransition(() => {
      router.push({
        pathname: "/restaurants",
        query: buildDiscoveryQuery(merged),
      });
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({ query: searchValue.trim() || undefined });
  }

  function clearFilters() {
    setSearchValue("");
    startTransition(() => {
      router.push("/restaurants");
    });
  }

  function handleViewChange(view: ViewMode) {
    navigate({ view }, false);
  }

  const hasActiveFilters = Boolean(
    filters.query ||
      filters.categorySlug ||
      filters.city ||
      filters.minRating ||
      filters.priceLevel ||
      filters.sort !== "rating",
  );

  const activeCategory = filters.categorySlug
    ? categories.find((category) => category.slug === filters.categorySlug)
    : undefined;

  return (
    <section className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} />

      <form
        key={filtersKey}
        onSubmit={(event) => {
          event.preventDefault();
          handleSearchSubmit(event);
        }}
        className="flex flex-col gap-3 lg:flex-row"
        role="search"
        aria-label={t("searchAriaLabel")}
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 lg:hidden"
            onClick={() => setShowFilters((open) => !open)}
          >
            <SlidersHorizontal className="size-4" />
            {t("filters.toggle")}
          </Button>
          <Button type="submit" className="h-11 flex-1 lg:flex-none">
            {t("searchButton")}
          </Button>
        </div>
      </form>

      <div
        className={cn(
          "grid gap-4 surface-card p-4 lg:grid-cols-4 xl:grid-cols-5",
          showFilters ? "block" : "hidden lg:grid",
        )}
      >
        <FilterSelect
          id="filter-category"
          label={t("filters.category")}
          value={filters.categorySlug ?? ""}
          onChange={(value) => navigate({ categorySlug: value || undefined })}
        >
          <option value="">{t("filters.allCategories")}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {getCategoryLabel(category, locale)}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-city"
          label={t("filters.city")}
          value={filters.city ?? ""}
          onChange={(value) => navigate({ city: value || undefined })}
        >
          <option value="">{t("filters.allCities")}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-rating"
          label={t("filters.minRating")}
          value={filters.minRating ? String(filters.minRating) : ""}
          onChange={(value) =>
            navigate({ minRating: value ? Number.parseInt(value, 10) : undefined })
          }
        >
          <option value="">{t("filters.anyRating")}</option>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {t("filters.ratingOption", { rating })}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-price"
          label={t("filters.priceLevel")}
          value={filters.priceLevel ? String(filters.priceLevel) : ""}
          onChange={(value) =>
            navigate({ priceLevel: value ? Number.parseInt(value, 10) : undefined })
          }
        >
          <option value="">{t("filters.anyPrice")}</option>
          {[1, 2, 3, 4].map((level) => (
            <option key={level} value={level}>
              {formatPriceRange(level, locale) ?? level}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-sort"
          label={t("filters.sort")}
          value={filters.sort}
          onChange={(value) =>
            navigate({ sort: value as DiscoveryFilters["sort"] })
          }
        >
          <option value="rating">{t("sort.rating")}</option>
          <option value="reviews">{t("sort.reviews")}</option>
          <option value="newest">{t("sort.newest")}</option>
          <option value="name">{t("sort.name")}</option>
        </FilterSelect>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t("resultsCount", { count: total })}
        </p>
        <ViewToggle view={filters.view} onChange={handleViewChange} />
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{t("activeFilters")}</span>
          {filters.query ? (
            <span className="rounded-full bg-muted px-3 py-1 text-foreground">
              {t("searchFilter", { query: filters.query })}
            </span>
          ) : null}
          {activeCategory ? (
            <span className="rounded-full bg-muted px-3 py-1 text-foreground">
              {getCategoryLabel(activeCategory, locale)}
            </span>
          ) : null}
          {filters.city ? (
            <span className="rounded-full bg-muted px-3 py-1 text-foreground">
              {filters.city}
            </span>
          ) : null}
          {filters.minRating ? (
            <span className="rounded-full bg-muted px-3 py-1 text-foreground">
              {t("filters.ratingChip", { rating: filters.minRating })}
            </span>
          ) : null}
          {filters.priceLevel ? (
            <span className="rounded-full bg-muted px-3 py-1 text-foreground">
              {formatPriceRange(filters.priceLevel, locale)}
            </span>
          ) : null}
          <button
            type="button"
            onClick={clearFilters}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
          >
            <XIcon className="size-3.5" />
            {t("clearFilters")}
          </button>
        </div>
      ) : null}

      {isPending ? (
        <div
          className={cn(
            filters.view === "list"
              ? "flex flex-col gap-4"
              : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} view={filters.view} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div
            className={cn(
              filters.view === "list"
                ? "flex flex-col gap-4"
                : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {items.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                view={filters.view}
              />
            ))}
          </div>

          {hasMore ? (
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate({ page: filters.page + 1 }, false)}
              >
                {t("loadMore")}
              </Button>
            </div>
          ) : null}

          {filters.page > 1 ? (
            <p className="text-center text-sm text-muted-foreground">
              {t("showingCount", { shown: items.length, total })}
            </p>
          ) : null}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-foreground">{t("emptyTitle")}</h2>
          <p className="mx-auto mt-2 max-w-md text-base/7 text-muted-foreground sm:text-sm/6">
            {t("emptyDescription")}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
            >
              {t("clearFilters")}
            </button>
          ) : (
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-6 inline-flex")}>
              {t("backHome")}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
