"use client";

import {
  Award,
  CakeSlice,
  Coffee,
  Drumstick,
  Fish,
  Globe2,
  LayoutGrid,
  List,
  MapPin,
  Soup,
  Sandwich,
  Star,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { PriceLabel } from "@/components/restaurants/price-label";
import { formatRating } from "@/components/restaurants/star-rating";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getCategoryLabel, isCategoryIconSlug } from "@/lib/categories";
import type { RestaurantSummary } from "@/lib/data/restaurant-types";
import { isGuestFavorite } from "@/lib/format-price";
import type { ViewMode } from "@/lib/restaurants/discovery-params";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  "uzbek-cuisine": Soup,
  "japanese-cuisine": Fish,
  "korean-cuisine": Drumstick,
  "turkish-cuisine": UtensilsCrossed,
  "european-cuisine": Globe2,
  "fast-food": Sandwich,
  "coffee-shop": Coffee,
  dessert: CakeSlice,
};

import { FALLBACK_RESTAURANT_IMAGE } from "@/lib/restaurant-images";

type RestaurantCardProps = {
  restaurant: RestaurantSummary;
  view?: ViewMode;
  className?: string;
};

function CategoryIcon({ slug }: { slug: string }) {
  const Icon = isCategoryIconSlug(slug) ? categoryIcons[slug] : UtensilsCrossed;
  return <Icon className="size-3.5 shrink-0 text-primary" aria-hidden />;
}

function GuestFavoriteBadge({ label }: { label: string }) {
  return (
    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
      <Award className="size-3.5 text-[#ffb400]" aria-hidden />
      {label}
    </span>
  );
}

function CardMetaRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-1.5 truncate text-[15px] text-muted-foreground">
      {icon}
      <span className="truncate">{children}</span>
    </p>
  );
}

export function RestaurantCard({
  restaurant,
  view = "grid",
  className,
}: RestaurantCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Restaurants.card");
  const imageUrl = restaurant.mainImageUrl ?? FALLBACK_RESTAURANT_IMAGE;
  const categoryLabel = getCategoryLabel(restaurant.category, locale);
  const rating =
    restaurant.reviewCount > 0 && restaurant.averageRating !== null
      ? formatRating(restaurant.averageRating)
      : null;
  const guestFavorite = isGuestFavorite(
    restaurant.averageRating,
    restaurant.reviewCount,
  );

  if (view === "list") {
    return (
      <Link
        href={`/restaurants/${restaurant.slug}`}
        className={cn(
          "group flex gap-4 rounded-xl border border-transparent p-2 transition hover:border-border hover:bg-muted/30",
          className,
        )}
      >
        <div className="relative aspect-[20/19] w-48 shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image
            src={imageUrl}
            alt={restaurant.name}
            fill
            sizes="192px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {guestFavorite ? (
            <GuestFavoriteBadge label={t("guestFavorite")} />
          ) : null}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5 py-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold text-foreground">
              {restaurant.name}
            </h3>
            {rating ? (
              <span className="inline-flex shrink-0 items-center gap-1 text-[15px] font-medium text-foreground">
                <Star className="size-3.5 fill-foreground" aria-hidden />
                {rating}
              </span>
            ) : null}
          </div>
          <CardMetaRow icon={<CategoryIcon slug={restaurant.category.slug} />}>
            {categoryLabel}
          </CardMetaRow>
          <CardMetaRow icon={<MapPin className="size-3.5 shrink-0 text-primary" aria-hidden />}>
            {restaurant.city}
          </CardMetaRow>
          {restaurant.priceLevel ? (
            <PriceLabel
              priceLevel={restaurant.priceLevel}
              locale={locale}
              perVisitLabel={t("perVisit")}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{t("noReviews")}</p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <article className={cn("group min-w-0", className)}>
      <Link href={`/restaurants/${restaurant.slug}`} className="block">
        <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-muted">
          <Image
            src={imageUrl}
            alt={restaurant.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {guestFavorite ? (
            <GuestFavoriteBadge label={t("guestFavorite")} />
          ) : null}
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold leading-snug text-foreground">
              {restaurant.name}
            </h3>
            {rating ? (
              <span className="inline-flex shrink-0 items-center gap-1 text-[15px] font-medium text-foreground">
                <Star className="size-3.5 fill-foreground" aria-hidden />
                {rating}
              </span>
            ) : null}
          </div>
          <CardMetaRow icon={<CategoryIcon slug={restaurant.category.slug} />}>
            {categoryLabel}
          </CardMetaRow>
          <CardMetaRow icon={<MapPin className="size-3.5 shrink-0 text-primary" aria-hidden />}>
            {restaurant.city}
          </CardMetaRow>
          {restaurant.priceLevel ? (
            <div className="pt-0.5">
              <PriceLabel
                priceLevel={restaurant.priceLevel}
                locale={locale}
                perVisitLabel={t("perVisit")}
              />
            </div>
          ) : (
            <p className="pt-0.5 text-sm text-muted-foreground">{t("noReviews")}</p>
          )}
        </div>
      </Link>
    </article>
  );
}

type CategoryCardProps = {
  slug: string;
  name: string;
  restaurantCount: number;
};

export function CategoryCard({ slug, name, restaurantCount }: CategoryCardProps) {
  const t = useTranslations("Home.categories");
  const Icon = isCategoryIconSlug(slug) ? categoryIcons[slug] : UtensilsCrossed;

  return (
    <Link
      href={{ pathname: "/restaurants", query: { category: slug } }}
      className="group surface-card block p-5 transition hover:border-primary/30"
    >
      <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="text-[15px] font-semibold text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("restaurantCount", { count: restaurantCount })}
      </p>
    </Link>
  );
}

export function RestaurantCardSkeleton({ view = "grid" }: { view?: ViewMode }) {
  if (view === "list") {
    return (
      <div className="flex gap-4">
        <div className="aspect-[20/19] w-48 shrink-0 animate-pulse rounded-xl bg-muted" />
        <div className="flex flex-1 flex-col gap-2 py-1">
          <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[20/19] animate-pulse rounded-xl bg-muted" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-xl border border-border p-5">
      <div className="mb-4 size-11 animate-pulse rounded-lg bg-muted" />
      <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}) {
  const t = useTranslations("Restaurants.view");

  return (
    <div
      className="inline-flex rounded-full border border-border p-1"
      role="group"
      aria-label={t("ariaLabel")}
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={cn(
          buttonVariants({ variant: view === "grid" ? "default" : "ghost", size: "sm" }),
          "gap-1.5 rounded-full",
        )}
        aria-pressed={view === "grid"}
      >
        <LayoutGrid className="size-4" aria-hidden />
        {t("grid")}
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          buttonVariants({ variant: view === "list" ? "default" : "ghost", size: "sm" }),
          "gap-1.5 rounded-full",
        )}
        aria-pressed={view === "list"}
      >
        <List className="size-4" aria-hidden />
        {t("list")}
      </button>
    </div>
  );
}
