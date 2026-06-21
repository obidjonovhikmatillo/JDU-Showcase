import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearchBar } from "@/components/admin/admin-search-bar";
import { AdminReviewsClient } from "@/components/admin/admin-reviews-client";
import { PageHeader } from "@/components/layout/page-shell";
import {
  listAdminReviewRestaurantOptions,
  listAdminReviewsPaginated,
} from "@/lib/data/admin-reviews.server";
import { serializeReviewForClient } from "@/lib/reviews/review-serialization";
import { parseOptionalInt, parseSearchParam } from "@/lib/admin/pagination";
import prisma from "@/lib/prisma";

type AdminReviewsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AdminReviews");
  return { title: t("title") };
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const params = await searchParams;
  const q = parseSearchParam(params.q);
  const restaurantParam = parseSearchParam(params.restaurantId);
  const restaurantId =
    restaurantParam && restaurantParam !== "all" ? restaurantParam : undefined;
  const ratingParam = parseOptionalInt(params.rating);
  const rating = ratingParam && ratingParam >= 1 && ratingParam <= 5 ? ratingParam : undefined;
  const page = parseOptionalInt(params.page) ?? 1;

  const [result, restaurants, t, tCommon] = await Promise.all([
    listAdminReviewsPaginated({ q, page, restaurantId, rating }),
    listAdminReviewRestaurantOptions(),
    getTranslations("AdminReviews"),
    getTranslations("AdminCommon"),
  ]);

  const reviewIds = result.items.map((item) => item.id);
  const reviewImages = reviewIds.length
    ? await prisma.reviewImage.findMany({
        where: { reviewId: { in: reviewIds } },
        select: { id: true, reviewId: true, imageUrl: true, publicId: true },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const imagesByReview = reviewImages.reduce<
    Record<string, { id: string; imageUrl: string; publicId: string | null }[]>
  >((acc, image) => {
    acc[image.reviewId] ??= [];
    acc[image.reviewId].push(image);
    return acc;
  }, {});

  const reviews = result.items.map((item) => ({
    ...serializeReviewForClient({
      id: item.id,
      rating: item.rating,
      title: item.title,
      content: item.content,
      visitDate: item.visitDate,
      createdAt: item.createdAt,
      user: item.user,
      images: imagesByReview[item.id] ?? [],
    }),
    restaurantSlug: item.restaurant.slug,
    restaurantName: item.restaurant.name,
  }));

  return (
    <section className="space-y-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <AdminSearchBar
        action="/admin/reviews"
        searchLabel={t("searchLabel")}
        searchPlaceholder={t("searchPlaceholder")}
        submitLabel={tCommon("applyFilters")}
        defaultQuery={q}
        filters={[
          {
            name: "restaurantId",
            label: t("restaurantFilter"),
            defaultValue: restaurantParam ?? "all",
            options: [
              { value: "all", label: t("allRestaurants") },
              ...restaurants.map((restaurant) => ({
                value: restaurant.id,
                label: restaurant.name,
              })),
            ],
          },
          {
            name: "rating",
            label: t("ratingFilter"),
            defaultValue: rating ? String(rating) : "all",
            options: [
              { value: "all", label: t("allRatings") },
              ...Array.from({ length: 5 }, (_, index) => ({
                value: String(index + 1),
                label: t("ratingOption", { rating: index + 1 }),
              })),
            ],
          },
        ]}
      />

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <AdminReviewsClient reviews={reviews} />
      )}

      <AdminPagination
        page={result.page}
        totalPages={result.totalPages}
        basePath="/admin/reviews"
        searchParams={{
          q,
          restaurantId: restaurantParam && restaurantParam !== "all" ? restaurantParam : undefined,
          rating: rating ? String(rating) : undefined,
        }}
      />
    </section>
  );
}
