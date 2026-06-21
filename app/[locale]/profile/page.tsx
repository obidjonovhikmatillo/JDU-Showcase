import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { PageHeader } from "@/components/layout/page-shell";
import { ProfilePanel } from "@/components/profile/profile-panel";
import { ProfileReviewsSection } from "@/components/profile/profile-reviews-section";
import { parseOptionalInt } from "@/lib/admin/pagination";
import {
  getProfileStats,
  getProfileUser,
  listUserProfileReviews,
} from "@/lib/data/profile.server";
import { requireAuth } from "@/lib/auth/guards";

type ProfilePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePage");

  return {
    title: t("title"),
  };
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await requireAuth("/profile");
  const params = await searchParams;
  const page = parseOptionalInt(params.page) ?? 1;
  const locale = await getLocale();
  const t = await getTranslations("ProfilePage");

  const [user, stats, reviewsResult] = await Promise.all([
    getProfileUser(session.user.id),
    getProfileStats(session.user.id),
    listUserProfileReviews(session.user.id, { page }),
  ]);

  if (!user) {
    notFound();
  }

  const registeredDateLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(user.createdAt);

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
        <LogoutButton />
      </div>

      <ProfilePanel user={user} stats={stats} registeredDateLabel={registeredDateLabel} />

      <ProfileReviewsSection
        reviews={reviewsResult.items}
        page={reviewsResult.page}
        totalPages={reviewsResult.totalPages}
      />
    </section>
  );
}
