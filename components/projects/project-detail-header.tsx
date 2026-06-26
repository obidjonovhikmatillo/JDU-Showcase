import { ExternalLinkIcon, CodeIcon, HeartIcon, BookmarkIcon, UserIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { formatRating, StarRating } from "@/components/projects/star-rating";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getCategoryLabel } from "@/lib/categories";
import type { ProjectDetailRecord } from "@/lib/data/comment-types";
import { cn } from "@/lib/utils";

type ProjectInfoCardProps = {
  project: ProjectDetailRecord;
};

export async function ProjectInfoCard({ project }: ProjectInfoCardProps) {
  const locale = await getLocale();
  const t = await getTranslations("ProjectDetail");

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <StarRating rating={project.averageRating ?? 0} size="sm" />
          <span className="text-base font-semibold text-foreground">
            {formatRating(project.averageRating)}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("commentCount", { count: project.commentCount })}
          </span>
        </div>

        <div className="space-y-3 border-t border-border pt-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <UserIcon className="size-5 text-primary" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-foreground">{project.authorName}</p>
              <p className="text-muted-foreground">{project.department}</p>
            </div>
          </div>

          {project.techStack ? (
            <div className="pt-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("techStack")}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {project.techStack.split(",").map((tech) => (
                  <span key={tech.trim()} className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {project.difficulty ? (
            <div className="pt-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("difficulty")}</p>
              <p className="mt-1 text-sm text-foreground">{project.difficulty}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "w-full rounded-full")}
            >
              <ExternalLinkIcon className="mr-2 size-4" aria-hidden />
              {t("liveDemo")}
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-full")}
            >
              <CodeIcon className="mr-2 size-4" aria-hidden />
              {t("sourceCode")}
            </a>
          ) : null}
          {!project.demoUrl && !project.githubUrl ? (
            <Link
              href="/projects"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-full")}
            >
              {t("browseMore")}
            </Link>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

type ProjectDetailHeaderProps = {
  project: ProjectDetailRecord;
};

export async function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  const locale = await getLocale();
  const t = await getTranslations("ProjectDetail");
  const categoryLabel = getCategoryLabel(project.category, locale);

  return (
    <header className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        {project.title}
      </h1>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <UserIcon className="size-5 text-primary" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{project.authorName}</p>
            <p className="text-xs text-muted-foreground">{categoryLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <HeartIcon className="size-4" aria-hidden />
            {project.commentCount}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-border p-2 text-foreground transition hover:bg-muted"
          >
            <BookmarkIcon className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
