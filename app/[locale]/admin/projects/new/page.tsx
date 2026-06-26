import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProjectAdminForm } from "@/components/admin/project-admin-form";
import { PageHeader } from "@/components/layout/page-shell";
import { listAdminCategoryOptions } from "@/lib/data/admin-projects.server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AdminProjectForm");
  return { title: t("createPageTitle") };
}

export default async function NewProjectPage() {
  const [categories, t] = await Promise.all([
    listAdminCategoryOptions(),
    getTranslations("AdminProjectForm"),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader title={t("createPageTitle")} subtitle={t("createPageSubtitle")} />
      <ProjectAdminForm mode="create" categories={categories} />
    </section>
  );
}
