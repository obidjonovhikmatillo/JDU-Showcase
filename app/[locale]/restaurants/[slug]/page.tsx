import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { RestaurantGalleryCarousel } from "@/components/restaurants/restaurant-gallery-carousel";
import {
  RestaurantDetailHeader,
  RestaurantInfoCard,
} from "@/components/restaurants/restaurant-detail-header";
import { RestaurantRatingShowcase } from "@/components/restaurants/restaurant-rating-showcase";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewSignInPrompt } from "@/components/reviews/review-sign-in-prompt";
import { auth } from "@/auth";
import { buildPageMetadata } from "@/lib/metadata";
import { getRestaurantDetailBySlug } from "@/lib/data/restaurant-detail.server";

type RestaurantDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: RestaurantDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const restaurant = await getRestaurantDetailBySlug(slug, locale);

  if (!restaurant) {
    const t = await getTranslations("RestaurantDetail");
    return { title: t("notFoundTitle") };
  }

  const description = restaurant.description.slice(0, 160);

  return buildPageMetadata({
    title: restaurant.name,
    description,
    locale,
    path: `/restaurants/${restaurant.slug}`,
    imageUrl: restaurant.mainImageUrl,
  });
}

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const session = await auth();
  const t = await getTranslations("RestaurantDetail");
  const restaurant = await getRestaurantDetailBySlug(slug, locale);

  if (!restaurant) {
    notFound();
  }

  return (
    <section className="space-y-8">
      <RestaurantGalleryCarousel
        mainImageUrl={restaurant.mainImageUrl}
        images={restaurant.galleryImages}
        restaurantName={restaurant.name}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div className="min-w-0 space-y-8">
          <RestaurantDetailHeader restaurant={restaurant} />

          <RestaurantRatingShowcase restaurant={restaurant} />

          <section className="surface-card space-y-4 p-6 sm:p-8">
            <h2 className="text-[22px] font-semibold text-foreground">{t("aboutTitle")}</h2>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              {restaurant.description}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[22px] font-semibold text-foreground">{t("reviewsTitle")}</h2>
            {session?.user?.id ? (
              <ReviewForm restaurantSlug={restaurant.slug} />
            ) : (
              <ReviewSignInPrompt restaurantSlug={restaurant.slug} />
            )}
            <ReviewList
              reviews={restaurant.reviews}
              restaurantSlug={restaurant.slug}
              viewer={
                session?.user?.id
                  ? { id: session.user.id, role: session.user.role }
                  : null
              }
            />
          </section>
        </div>

        <RestaurantInfoCard restaurant={restaurant} />
      </div>
    </section>
  );
}
