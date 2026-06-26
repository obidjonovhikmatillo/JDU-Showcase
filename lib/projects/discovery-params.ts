export const PROJECT_PAGE_SIZE = 6;

export type SortOption = "rating" | "comments" | "newest" | "title";
export type ViewMode = "grid" | "list";

export type DiscoveryFilters = {
  query?: string;
  categorySlug?: string;
  department?: string;
  minRating?: number;
  sort: SortOption;
  page: number;
  view: ViewMode;
};

export type DiscoverySearchParams = {
  q?: string;
  category?: string;
  department?: string;
  minRating?: string;
  sort?: string;
  page?: string;
  view?: string;
};

const SORT_OPTIONS: SortOption[] = ["rating", "comments", "newest", "title"];

export function parseSort(value?: string): SortOption {
  if (value && SORT_OPTIONS.includes(value as SortOption)) {
    return value as SortOption;
  }

  return "rating";
}

export function parseViewMode(value?: string): ViewMode {
  return value === "list" ? "list" : "grid";
}

export function parseDiscoveryParams(
  searchParams: DiscoverySearchParams,
): DiscoveryFilters {
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1);
  const minRatingRaw = searchParams.minRating
    ? Number.parseInt(searchParams.minRating, 10)
    : undefined;

  return {
    query: searchParams.q?.trim() || undefined,
    categorySlug: searchParams.category?.trim() || undefined,
    department: searchParams.department?.trim() || undefined,
    minRating:
      minRatingRaw && minRatingRaw >= 1 && minRatingRaw <= 5
        ? minRatingRaw
        : undefined,
    sort: parseSort(searchParams.sort),
    page,
    view: parseViewMode(searchParams.view),
  };
}

export function buildDiscoveryQuery(
  filters: DiscoveryFilters,
  overrides: Partial<DiscoveryFilters> = {},
): Record<string, string> {
  const merged = { ...filters, ...overrides };
  const query: Record<string, string> = {};

  if (merged.query) query.q = merged.query;
  if (merged.categorySlug) query.category = merged.categorySlug;
  if (merged.department) query.department = merged.department;
  if (merged.minRating) query.minRating = String(merged.minRating);
  if (merged.sort !== "rating") query.sort = merged.sort;
  if (merged.page > 1) query.page = String(merged.page);
  if (merged.view === "list") query.view = merged.view;

  return query;
}

export function discoveryFiltersKey(filters: DiscoveryFilters): string {
  return JSON.stringify(buildDiscoveryQuery(filters));
}
