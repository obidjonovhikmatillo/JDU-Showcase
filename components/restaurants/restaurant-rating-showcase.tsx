import {
  Award,
  CheckCircle2,
  KeyRound,
  MapPin,
  MessageCircle,
  Sparkles,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { formatRating } from "@/components/restaurants/star-rating";
import { getCategoryLabel } from "@/lib/categories";
import type { RestaurantDetailRecord } from "@/lib/data/review-types";
import {
  computeRatingDistribution,
  isGuestFavorite,
} from "@/lib/format-price";
import { cn } from "@/lib/utils";

type RestaurantRatingShowcaseProps = {
  restaurant: RestaurantDetailRecord;
};

function LaurelIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("size-8 text-[#ffb400]", className)}
      fill="currentColor"
    >
      <path d="M16 4c-2 3-5 5-8 6 1 2 2 4 2 6 2-1 4-2 6-2 0-2 1-4 2-6-3-1-6-3-8-6zm-9 8c-1 2-1 4 0 6 2-1 3-2 5-2-1-2-2-3-5-4zm18 0c-3 1-4 2-5 4 2 0 3 1 5 2 1-2 1-4 0-6z" />
    </svg>
  );
}

function RatingHistogram({ distribution }: { distribution: number[] }) {
  const max = Math.max(...distribution, 1);

  return (
    <div className="flex h-10 items-end gap-0.5" aria-hidden>
      {distribution.map((count, index) => {
        const height = Math.max(8, Math.round((count / max) * 100));

        return (
          <div
            key={index}
            className="w-1.5 rounded-sm bg-foreground/80"
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}

function MetricColumn({
  label,
  score,
  icon: Icon,
  children,
}: {
  label: string;
  score?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 px-3 text-center sm:px-4">
      {score ? (
        <p className="text-sm font-semibold text-foreground">{score}</p>
      ) : null}
      {children}
      <Icon className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden />
      <p className="text-xs font-semibold text-foreground">{label}</p>
    </div>
  );
}

export async function RestaurantRatingShowcase({
  restaurant,
}: RestaurantRatingShowcaseProps) {
  const locale = await getLocale();
  const t = await getTranslations("RestaurantDetail.ratingShowcase");
  const categoryLabel = getCategoryLabel(restaurant.category, locale);

  if (restaurant.reviewCount === 0 || restaurant.averageRating === null) {
    return null;
  }

  const ratings = restaurant.reviews.map((review) => review.rating);
  const distribution = computeRatingDistribution(ratings);
  const displayRating = formatRating(restaurant.averageRating);
  const guestFavorite = isGuestFavorite(
    restaurant.averageRating,
    restaurant.reviewCount,
  );

  const valueScore = restaurant.priceLevel
    ? formatRating(Math.min(5, 3.8 + (5 - restaurant.priceLevel) * 0.35))
    : displayRating;

  const tags = [
    {
      icon: "🍽️",
      label: categoryLabel,
      count: restaurant.reviewCount,
    },
    {
      icon: "📍",
      label: restaurant.city,
      count: Math.max(1, Math.round(restaurant.reviewCount * 0.6)),
    },
    {
      icon: "✨",
      label: t("tagAtmosphere"),
      count: Math.max(1, Math.round(restaurant.reviewCount * 0.4)),
    },
    {
      icon: "👨‍🍳",
      label: t("tagFood"),
      count: Math.max(1, Math.round(restaurant.reviewCount * 0.7)),
    },
  ];

  return (
    <section className="surface-card overflow-hidden py-8 sm:py-10">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <LaurelIcon className="hidden sm:block" />
          <p className="text-[48px] font-semibold leading-none tracking-[-0.03em] text-foreground sm:text-[56px]">
            {displayRating}
          </p>
          <LaurelIcon className="hidden scale-x-[-1] sm:block" />
        </div>

        {guestFavorite ? (
          <>
            <p className="mt-3 flex items-center justify-center gap-2 text-lg font-semibold text-foreground">
              <Award className="size-5 text-[#ffb400]" aria-hidden />
              {t("guestFavorite")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("guestFavoriteDescription")}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("basedOnReviews", { count: restaurant.reviewCount })}
          </p>
        )}
      </div>

      <div className="mt-8 flex divide-x divide-border overflow-x-auto px-4 sm:px-6">
        <MetricColumn label={t("overall")} icon={Sparkles}>
          <RatingHistogram distribution={distribution} />
        </MetricColumn>
        <MetricColumn label={t("food")} score={displayRating} icon={UtensilsCrossed} />
        <MetricColumn label={t("service")} score={displayRating} icon={MessageCircle} />
        <MetricColumn label={t("location")} score="5.0" icon={MapPin} />
        <MetricColumn label={t("value")} score={valueScore} icon={Tag} />
        <MetricColumn label={t("checkIn")} score={displayRating} icon={KeyRound} />
        <MetricColumn label={t("accuracy")} score={displayRating} icon={CheckCircle2} />
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:px-6">
        {tags.map((tag) => (
          <span
            key={tag.label}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm text-foreground"
          >
            <span aria-hidden>{tag.icon}</span>
            <span className="font-medium">{tag.label}</span>
            <span className="text-muted-foreground">{tag.count}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
