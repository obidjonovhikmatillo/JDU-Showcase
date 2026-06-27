import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { FALLBACK_PROJECT_IMAGE } from "@/lib/project-images";

type AuthorProject = {
  slug: string;
  title: string;
  mainImageUrl: string | null;
  authorName: string;
};

type MoreByAuthorProps = {
  authorName: string;
  projects: AuthorProject[];
};

export async function MoreByAuthor({
  authorName,
  projects,
}: MoreByAuthorProps) {
  const t = await getTranslations("ProjectDetail");

  if (projects.length === 0) {
    return null;
  }

  const visible = projects.slice(0, 4);
  const hasMore = projects.length > 4;

  return (
    <section className="space-y-5 border-t border-border pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          {t("moreByAuthor", { author: authorName })}
        </h2>
        {hasMore ? (
          <Link
            href={{
              pathname: "/projects",
              query: { search: authorName },
            }}
            className="text-sm font-medium text-primary transition hover:text-primary/80"
          >
            {t("viewProfile")}
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {visible.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted transition-all duration-300 group-hover:shadow-lg">
              <Image
                src={project.mainImageUrl ?? FALLBACK_PROJECT_IMAGE}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
