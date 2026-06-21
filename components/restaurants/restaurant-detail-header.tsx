import { MapPinIcon, Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { PriceLabel } from "@/components/restaurants/price-label";
import { formatRating, StarRating } from "@/components/restaurants/star-rating";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getCategoryLabel } from "@/lib/categories";
import type { RestaurantDetailRecord } from "@/lib/data/review-types";
import { cn } from "@/lib/utils";

type RestaurantInfoCardProps = {
  restaurant: RestaurantDetailRecord;
};

export async function RestaurantInfoCard({ restaurant }: RestaurantInfoCardProps) {
  const locale = await getLocale();
  const t = await getTranslations("RestaurantDetail");

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="surface-card p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            {restaurant.priceLevel ? (
              <PriceLabel
                priceLevel={restaurant.priceLevel}
                locale={locale}
                perVisitLabel={t("priceHint")}
                variant="prominent"
              />
            ) : null}
            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={restaurant.averageRating ?? 0} size="sm" />
              <span className="text-[15px] font-semibold text-foreground">
                {formatRating(restaurant.averageRating)}
              </span>
              <span className="text-sm text-muted-foreground underline">
                {t("reviewCount", { count: restaurant.reviewCount })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
          <p className="inline-flex items-start gap-2 text-muted-foreground">
            <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span>
              {restaurant.address}, {restaurant.city}
            </span>
          </p>
          {restaurant.openingHours ? (
            <p>
              <span className="font-semibold text-foreground">{t("hours")}: </span>
              <span className="text-muted-foreground">{restaurant.openingHours}</span>
            </p>
          ) : null}
          {restaurant.phone ? (
            <p>
              <span className="font-semibold text-foreground">{t("phone")}: </span>
              <span className="text-muted-foreground">{restaurant.phone}</span>
            </p>
          ) : null}
        </div>

        {restaurant.website ? (
          <a
            href={restaurant.website}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full rounded-lg")}
          >
            {t("website")}
          </a>
        ) : (
          <Link
            href="/restaurants"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-6 w-full rounded-lg")}
          >
            {t("browseMore")}
          </Link>
        )}
      </div>
    </aside>
  );
}

type RestaurantDetailHeaderProps = {
  restaurant: RestaurantDetailRecord;
};

export async function RestaurantDetailHeader({ restaurant }: RestaurantDetailHeaderProps) {
  const locale = await getLocale();
  const categoryLabel = getCategoryLabel(restaurant.category, locale);

  return (
    <header className="space-y-2 pb-2">
      <p className="text-sm font-medium text-primary">{categoryLabel}</p>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[32px]">
          {restaurant.name}
        </h1>
        <div className="inline-flex items-center gap-1 text-[15px] font-semibold text-foreground">
          <Star className="size-4 fill-foreground" aria-hidden />
          {formatRating(restaurant.averageRating)}
        </div>
      </div>
    </header>
  );
}
