"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { PageHeader } from "@/components/layout/page-header";
import {
  ProjectCard,
  ProjectCardSkeleton,
} from "@/components/projects/project-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { getCategoryLabel } from "@/lib/categories";
import type { CategoryWithCount } from "@/lib/data/project-types";
import {
  buildDiscoveryQuery,
  type DiscoveryFilters,
} from "@/lib/projects/discovery-params";
import type { DiscoveryResult } from "@/lib/projects/discovery-types";
import { cn } from "@/lib/utils";

type ProjectDiscoveryProps = {
  result: DiscoveryResult;
  categories: CategoryWithCount[];
  departments: string[];
  title: string;
  subtitle: string;
  filtersKey: string;
};

export function ProjectDiscovery({
  result,
  categories,
  departments,
  title,
  subtitle,
  filtersKey,
}: ProjectDiscoveryProps) {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { filters, items, total, hasMore } = result;

  const [searchValue, setSearchValue] = useState(filters.query ?? "");

  function navigate(next: Partial<DiscoveryFilters>, resetPage = true) {
    const merged = {
      ...filters,
      ...next,
      page: resetPage ? 1 : (next.page ?? filters.page),
    };

    startTransition(() => {
      router.push({
        pathname: "/projects",
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
      router.push("/projects");
    });
  }

  const hasActiveFilters = Boolean(
    filters.query ||
      filters.categorySlug ||
      filters.department ||
      filters.minRating ||
      filters.sort !== "rating",
  );

  const activeCategory = filters.categorySlug
    ? categories.find((category) => category.slug === filters.categorySlug)
    : undefined;

  return (
    <section className="space-y-8">
      <PageHeader title={title} subtitle={subtitle} />

      {/* Filter bar: search + sort + category pills */}
      <div className="space-y-4">
        {/* Search row */}
        <form
          key={filtersKey}
          onSubmit={(event) => {
            event.preventDefault();
            handleSearchSubmit(event);
          }}
          className="flex gap-3"
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
              className="h-10 rounded-full pl-10"
            />
          </div>

          {/* Sort dropdown */}
          <select
            value={filters.sort}
            onChange={(event) =>
              navigate({ sort: event.target.value as DiscoveryFilters["sort"] })
            }
            className="h-10 rounded-full border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <option value="rating">{t("sort.rating")}</option>
            <option value="comments">{t("sort.comments")}</option>
            <option value="newest">{t("sort.newest")}</option>
            <option value="title">{t("sort.name")}</option>
          </select>

          <Button type="submit" className="h-10 rounded-full px-6">
            {t("searchButton")}
          </Button>
        </form>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate({ categorySlug: undefined })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !filters.categorySlug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted",
            )}
          >
            {t("filters.allCategories")}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => navigate({ categorySlug: category.slug })}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                filters.categorySlug === category.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {getCategoryLabel(category, locale)}
            </button>
          ))}
        </div>

        {/* Department + rating filters (compact row) */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filters.department ?? ""}
            onChange={(event) =>
              navigate({ department: event.target.value || undefined })
            }
            className="h-9 rounded-full border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
          >
            <option value="">{t("filters.allDepartments")}</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          <select
            value={filters.minRating ? String(filters.minRating) : ""}
            onChange={(event) =>
              navigate({
                minRating: event.target.value
                  ? Number.parseInt(event.target.value, 10)
                  : undefined,
              })
            }
            className="h-9 rounded-full border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
          >
            <option value="">{t("filters.anyRating")}</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {t("filters.ratingOption", { rating })}
              </option>
            ))}
          </select>

          {/* Results count */}
          <span className="ml-auto text-sm text-muted-foreground">
            {t("resultsCount", { count: total })}
          </span>
        </div>
      </div>

      {/* Active filters chips */}
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
          {filters.department ? (
            <span className="rounded-full bg-muted px-3 py-1 text-foreground">
              {filters.department}
            </span>
          ) : null}
          {filters.minRating ? (
            <span className="rounded-full bg-muted px-3 py-1 text-foreground">
              {t("filters.ratingChip", { rating: filters.minRating })}
            </span>
          ) : null}
          <button
            type="button"
            onClick={clearFilters}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1 rounded-full",
            )}
          >
            <XIcon className="size-3.5" />
            {t("clearFilters")}
          </button>
        </div>
      ) : null}

      {/* Project grid */}
      {isPending ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {hasMore ? (
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-full"
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
          <h2 className="text-xl font-semibold text-foreground">
            {t("emptyTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-base/7 text-muted-foreground sm:text-sm/6">
            {t("emptyDescription")}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-6 rounded-full",
              )}
            >
              {t("clearFilters")}
            </button>
          ) : (
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-6 inline-flex rounded-full",
              )}
            >
              {t("backHome")}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
