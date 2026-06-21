import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { RestaurantAdminForm } from "@/components/admin/restaurant-admin-form";
import { PageHeader } from "@/components/layout/page-shell";
import { listAdminCategoryOptions } from "@/lib/data/admin-restaurants.server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AdminRestaurantForm");
  return { title: t("createPageTitle") };
}

export default async function NewRestaurantPage() {
  const [categories, t] = await Promise.all([
    listAdminCategoryOptions(),
    getTranslations("AdminRestaurantForm"),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader title={t("createPageTitle")} subtitle={t("createPageSubtitle")} />
      <RestaurantAdminForm mode="create" categories={categories} />
    </section>
  );
}
