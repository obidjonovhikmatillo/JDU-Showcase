import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { PageHeader } from "@/components/layout/page-shell";
import { Link } from "@/i18n/navigation";
import { getAdminDashboardStats } from "@/lib/data/admin-dashboard.server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin");
  return { title: t("title") };
}

function formatRating(value: number | null) {
  if (value === null) {
    return "—";
  }

  return value.toFixed(1);
}

export default async function AdminPage() {
  const t = await getTranslations("Admin");
  const tDashboard = await getTranslations("AdminDashboard");
  const stats = await getAdminDashboardStats();

  return (
    <section className="space-y-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label={tDashboard("totalRestaurants")} value={stats.totalRestaurants} />
        <AdminStatCard label={tDashboard("publishedRestaurants")} value={stats.publishedRestaurants} />
        <AdminStatCard label={tDashboard("totalUsers")} value={stats.totalUsers} />
        <AdminStatCard label={tDashboard("totalReviews")} value={stats.totalReviews} />
      </div>

      <AdminStatCard
        label={tDashboard("averageRating")}
        value={formatRating(stats.averagePlatformRating)}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="surface-card min-w-0 space-y-3 p-4">
          <h2 className="font-semibold">{tDashboard("recentUsers")}</h2>
          {stats.recentUsers.length === 0 ? (
            <p className="text-base/7 text-muted-foreground sm:text-sm/6">{tDashboard("empty")}</p>
          ) : (
            <ul className="space-y-2 text-base/7 sm:text-sm/6">
              {stats.recentUsers.map((user) => (
                <li key={user.id} className="flex min-w-0 justify-between gap-2">
                  <span className="truncate">{user.fullName}</span>
                  <span className="shrink-0 text-muted-foreground">{user.email}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface-card min-w-0 space-y-3 p-4">
          <h2 className="font-semibold">{tDashboard("recentReviews")}</h2>
          {stats.recentReviews.length === 0 ? (
            <p className="text-base/7 text-muted-foreground sm:text-sm/6">{tDashboard("empty")}</p>
          ) : (
            <ul className="space-y-2 text-base/7 sm:text-sm/6">
              {stats.recentReviews.map((review) => (
                <li key={review.id} className="min-w-0">
                  <p className="truncate font-medium">{review.title}</p>
                  <p className="truncate text-muted-foreground">
                    {review.user.fullName} · {review.restaurant.name} · {review.rating}/5
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surface-card min-w-0 space-y-3 p-4">
          <h2 className="font-semibold">{tDashboard("topRestaurants")}</h2>
          {stats.mostReviewedRestaurants.length === 0 ? (
            <p className="text-base/7 text-muted-foreground sm:text-sm/6">{tDashboard("empty")}</p>
          ) : (
            <ul className="space-y-2 text-base/7 sm:text-sm/6">
              {stats.mostReviewedRestaurants.map((restaurant) => (
                <li key={restaurant.id} className="flex min-w-0 justify-between gap-2">
                  <Link
                    href={`/admin/restaurants/${restaurant.slug}/edit`}
                    className="truncate font-medium hover:underline focus-visible:underline"
                  >
                    {restaurant.name}
                  </Link>
                  <span className="shrink-0 text-muted-foreground">
                    {tDashboard("reviewCount", { count: restaurant._count.reviews })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
