import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearchBar } from "@/components/admin/admin-search-bar";
import { RestaurantRowActions } from "@/components/admin/restaurant-row-actions";
import { PageHeader } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  listAdminCategoryOptions,
  listAdminRestaurantsPaginated,
} from "@/lib/data/admin-restaurants.server";
import {
  parseOptionalInt,
  parseSearchParam,
} from "@/lib/admin/pagination";
import { cn } from "@/lib/utils";

type AdminRestaurantsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AdminRestaurants");
  return { title: t("title") };
}

export default async function AdminRestaurantsPage({
  searchParams,
}: AdminRestaurantsPageProps) {
  const params = await searchParams;
  const q = parseSearchParam(params.q);
  const publishedParam = parseSearchParam(params.published) ?? "all";
  const categoryParam = parseSearchParam(params.categoryId);
  const categoryId = categoryParam && categoryParam !== "all" ? categoryParam : undefined;
  const page = parseOptionalInt(params.page) ?? 1;

  const [result, categories, t, tCommon] = await Promise.all([
    listAdminRestaurantsPaginated({
      q,
      page,
      published:
        publishedParam === "published" || publishedParam === "draft"
          ? publishedParam
          : "all",
      categoryId,
    }),
    listAdminCategoryOptions(),
    getTranslations("AdminRestaurants"),
    getTranslations("AdminCommon"),
  ]);

  const filterParams = {
    q,
    published: publishedParam !== "all" ? publishedParam : undefined,
    categoryId: categoryParam && categoryParam !== "all" ? categoryParam : undefined,
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
        <Link href="/admin/restaurants/new" className={cn(buttonVariants())}>
          {t("addRestaurant")}
        </Link>
      </div>

      <AdminSearchBar
        action="/admin/restaurants"
        searchLabel={t("searchLabel")}
        searchPlaceholder={t("searchPlaceholder")}
        submitLabel={tCommon("applyFilters")}
        defaultQuery={q}
        filters={[
          {
            name: "published",
            label: t("statusFilter"),
            defaultValue: publishedParam,
            options: [
              { value: "all", label: t("allStatuses") },
              { value: "published", label: t("published") },
              { value: "draft", label: t("draft") },
            ],
          },
          {
            name: "categoryId",
            label: t("categoryFilter"),
            defaultValue: categoryParam ?? "all",
            options: [
              { value: "all", label: t("allCategories") },
              ...categories.map((category) => ({
                value: category.id,
                label: category.nameEn,
              })),
            ],
          },
        ]}
      />

      {result.items.length === 0 ? (
        <EmptyState title={t("empty")} className="py-10" />
      ) : (
        <div className="space-y-4">
          {result.items.map((restaurant) => (
            <Card key={restaurant.id}>
              <CardContent className="flex min-w-0 flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  {restaurant.mainImageUrl ? (
                    <div className="relative size-16 overflow-hidden rounded-lg border border-border/60">
                      <Image
                        src={restaurant.mainImageUrl}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">{restaurant.name}</h2>
                    <p className="text-base/7 text-muted-foreground sm:text-sm/6">
                      {t("meta", {
                        city: restaurant.city,
                        galleryCount: restaurant._count.images,
                        reviewCount: restaurant._count.reviews,
                        status: restaurant.isPublished ? t("published") : t("draft"),
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">{restaurant.category.nameEn}</p>
                  </div>
                </div>
                <RestaurantRowActions
                  restaurantId={restaurant.id}
                  slug={restaurant.slug}
                  isPublished={restaurant.isPublished}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminPagination
        page={result.page}
        totalPages={result.totalPages}
        basePath="/admin/restaurants"
        searchParams={filterParams}
      />
    </section>
  );
}
