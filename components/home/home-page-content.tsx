import { ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import { CtaSection } from "@/components/home/benefits-section";
import { HeroSection } from "@/components/home/hero-section";
import { HomeErrorState } from "@/components/home/home-error-state";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getHomePageData } from "@/lib/data/projects";
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
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.id);

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
    <div>
      <HeroSection categories={categories} isAuthenticated={isAuthenticated} />

      <div className="space-y-14 md:space-y-16">
        {topRated.length > 0 && (
          <section aria-labelledby="top-rated-heading">
            <SectionHeader
              title={t("topRated.title")}
              href="/projects"
              linkLabel={t("topRated.viewAll")}
            />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {topRated.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="recent-heading">
          <SectionHeader
            title={t("recent.title")}
            href="/projects"
            linkLabel={t("recent.viewAll")}
          />
          {recent.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recent.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState className="mt-2" title={t("recent.empty")} />
          )}
        </section>

        <CtaSection />
      </div>
    </div>
  );
}
