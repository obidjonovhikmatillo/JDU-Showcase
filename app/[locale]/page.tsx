export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";

import { buildPageMetadata } from "@/lib/metadata";
import { HomePageContent } from "@/components/home/home-page-content";
import { HomePageSkeleton } from "@/components/home/home-page-skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Home");

  return buildPageMetadata({
    title: t("title"),
    description: t("subtitle"),
    locale,
    path: "",
  });
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}
