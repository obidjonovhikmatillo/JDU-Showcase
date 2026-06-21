import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearchBar } from "@/components/admin/admin-search-bar";
import { CategoryAdminPanel } from "@/components/admin/category-admin-panel";
import { PageHeader } from "@/components/layout/page-shell";
import { listAdminCategoriesPaginated } from "@/lib/data/admin-categories.server";
import { parseOptionalInt, parseSearchParam } from "@/lib/admin/pagination";

type AdminCategoriesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AdminCategories");
  return { title: t("title") };
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const params = await searchParams;
  const q = parseSearchParam(params.q);
  const page = parseOptionalInt(params.page) ?? 1;

  const [result, t, tCommon] = await Promise.all([
    listAdminCategoriesPaginated({ q, page }),
    getTranslations("AdminCategories"),
    getTranslations("AdminCommon"),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <AdminSearchBar
        action="/admin/categories"
        searchLabel={t("searchLabel")}
        searchPlaceholder={t("searchPlaceholder")}
        submitLabel={tCommon("applyFilters")}
        defaultQuery={q}
      />

      <CategoryAdminPanel categories={result.items} />

      <AdminPagination
        page={result.page}
        totalPages={result.totalPages}
        basePath="/admin/categories"
        searchParams={{ q }}
      />
    </section>
  );
}
