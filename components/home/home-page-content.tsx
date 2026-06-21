import { ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { BenefitsSection, CtaSection } from "@/components/home/benefits-section";
import { HomeErrorState } from "@/components/home/home-error-state";
import {
  CategoryCard,
  RestaurantCard,
} from "@/components/restaurants/restaurant-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getHomePageData } from "@/lib/data/restaurants";
import { getCategoryLabel } from "@/lib/categories";
import { Link } from "@/i18n/navigation";

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2 className="text-[22px] font-semibold text-foreground sm:text-2xl">{title}</h2>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
      >
        {linkLabel}
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

export async function HomePageContent() {
  const t = await getTranslations("Home");
  const locale = await getLocale();

  let categories;
  let topRated;
  let recent;

  try {
    const data = await getHomePageData();
    categories = data.categories;
    topRated = data.topRated;
    recent = data.recent;
  } catch (error) {
    console.error("Home page data error:", error);
    return <HomeErrorState />;
  }

  return (
    <div className="space-y-14 md:space-y-16">
      <section aria-labelledby="categories-heading">
        <SectionHeader
          title={t("categories.title")}
          href="/restaurants"
          linkLabel={t("categories.viewAll")}
        />
        {categories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                slug={category.slug}
                name={getCategoryLabel(category, locale)}
                restaurantCount={category.restaurantCount}
              />
            ))}
          </div>
        ) : (
          <EmptyState className="mt-2" title={t("categories.empty")} />
        )}
      </section>

      <section aria-labelledby="top-rated-heading">
        <SectionHeader
          title={t("topRated.title")}
          href="/restaurants"
          linkLabel={t("topRated.viewAll")}
        />
        {topRated.length > 0 ? (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {topRated.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <EmptyState className="mt-2" title={t("topRated.empty")} />
        )}
      </section>

      <section aria-labelledby="recent-heading">
        <SectionHeader
          title={t("recent.title")}
          href="/restaurants"
          linkLabel={t("recent.viewAll")}
        />
        {recent.length > 0 ? (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <EmptyState className="mt-2" title={t("recent.empty")} />
        )}
      </section>

      <BenefitsSection />
      <CtaSection />
    </div>
  );
}
