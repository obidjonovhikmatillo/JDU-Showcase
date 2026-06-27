export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { ProjectDiscovery } from "@/components/projects/project-discovery";
import { ProjectsErrorState } from "@/components/projects/projects-error-state";
import { getCategoryLabel } from "@/lib/categories";
import {
  discoverProjects,
  getDiscoveryFacets,
} from "@/lib/projects/discovery";
import {
  discoveryFiltersKey,
  parseDiscoveryParams,
  type DiscoverySearchParams,
} from "@/lib/projects/discovery-params";

type ProjectsPageProps = {
  searchParams: Promise<DiscoverySearchParams>;
};

function buildSubtitle(
  t: Awaited<ReturnType<typeof getTranslations>>,
  filters: ReturnType<typeof parseDiscoveryParams>,
  categoryName?: string,
) {
  const parts: string[] = [];

  if (filters.query) {
    parts.push(t("searchSubtitle", { query: filters.query }));
  }

  if (categoryName) {
    parts.push(t("filteredSubtitle", { category: categoryName }));
  }

  if (filters.department) {
    parts.push(t("citySubtitle", { city: filters.department }));
  }

  if (parts.length === 0) {
    return t("subtitle");
  }

  return parts.join(" ");
}

export async function generateMetadata({
  searchParams,
}: ProjectsPageProps): Promise<Metadata> {
  const t = await getTranslations("Projects");
  const params = parseDiscoveryParams(await searchParams);

  if (params.query) {
    return { title: t("searchTitle", { query: params.query }) };
  }

  if (params.categorySlug) {
    return { title: t("filteredTitle") };
  }

  return { title: t("title") };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const t = await getTranslations("Projects");
  const locale = await getLocale();
  const filters = parseDiscoveryParams(await searchParams);

  let categories;
  let departments;
  let result;

  try {
    [{ categories, departments }, result] = await Promise.all([
      getDiscoveryFacets(),
      discoverProjects(filters),
    ]);
  } catch (error) {
    console.error("Projects page error:", error);
    return <ProjectsErrorState />;
  }

  const activeCategory = filters.categorySlug
    ? categories.find((item) => item.slug === filters.categorySlug)
    : undefined;

  const subtitle = buildSubtitle(
    t,
    filters,
    activeCategory ? getCategoryLabel(activeCategory, locale) : undefined,
  );

  return (
    <ProjectDiscovery
      key={discoveryFiltersKey(filters)}
      result={result}
      categories={categories}
      departments={departments}
      title={t("title")}
      subtitle={subtitle}
      filtersKey={discoveryFiltersKey(filters)}
    />
  );
}
