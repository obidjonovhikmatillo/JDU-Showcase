import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FilterOption = { value: string; label: string };

type AdminSearchBarProps = {
  action: string;
  searchPlaceholder: string;
  searchLabel: string;
  submitLabel: string;
  defaultQuery?: string;
  filters?: Array<{
    name: string;
    label: string;
    defaultValue?: string;
    options: FilterOption[];
  }>;
};

const selectClassName = cn(
  "flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "dark:bg-input/30",
);

export function AdminSearchBar({
  action,
  searchPlaceholder,
  searchLabel,
  submitLabel,
  defaultQuery = "",
  filters = [],
}: AdminSearchBarProps) {
  return (
    <form
      action={action}
      method="get"
      className="rounded-xl border border-border/60 bg-card p-4"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="admin-search-q"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            {searchLabel}
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="admin-search-q"
              name="q"
              defaultValue={defaultQuery}
              placeholder={searchPlaceholder}
              className="pl-8"
            />
          </div>
        </div>

        {filters.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:items-end xl:gap-3">
            {filters.map((filter) => (
              <div key={filter.name} className="min-w-0 xl:w-40">
                <label
                  htmlFor={`admin-filter-${filter.name}`}
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  {filter.label}
                </label>
                <select
                  id={`admin-filter-${filter.name}`}
                  name={filter.name}
                  defaultValue={filter.defaultValue ?? "all"}
                  className={selectClassName}
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ) : null}

        <Button type="submit" className="w-full shrink-0 xl:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
