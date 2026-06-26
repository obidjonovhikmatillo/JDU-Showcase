"use client";

import {
  Code2,
  Database,
  Eye,
  Globe2,
  Heart,
  Monitor,
  Palette,
  Server,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { getCategoryLabel, isCategoryIconSlug } from "@/lib/categories";
import type { ProjectSummary } from "@/lib/data/project-types";
import type { ViewMode } from "@/lib/projects/discovery-params";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useProjectModal } from "@/components/projects/project-modal-provider";

const categoryIcons: Record<string, LucideIcon> = {
  "web-development": Globe2,
  "mobile-app": Monitor,
  "backend": Server,
  "frontend": Palette,
  "database": Database,
  "devops": Wrench,
  "machine-learning": Code2,
  "other": Code2,
};

import { FALLBACK_PROJECT_IMAGE } from "@/lib/project-images";

type ProjectCardProps = {
  project: ProjectSummary;
  view?: ViewMode;
  className?: string;
};

const categoryColors: Record<string, string> = {
  "web-development": "bg-blue-500",
  "mobile-app": "bg-purple-500",
  "backend": "bg-green-500",
  "frontend": "bg-pink-500",
  "database": "bg-amber-500",
  "devops": "bg-cyan-500",
  "machine-learning": "bg-indigo-500",
  "other": "bg-gray-400",
};

export function ProjectCard({
  project,
  view = "grid",
  className,
}: ProjectCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Projects.card");
  const { openModal } = useProjectModal();
  const imageUrl = project.mainImageUrl ?? FALLBACK_PROJECT_IMAGE;
  const categoryLabel = getCategoryLabel(project.category, locale);
  const dotColor = categoryColors[project.category.slug] ?? "bg-gray-400";

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    openModal(project.slug);
  }

  return (
    <article className={cn("group min-w-0", className)}>
      <a
        href={`/projects/${project.slug}`}
        onClick={handleClick}
        className="block cursor-pointer"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/10">
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/10">
              <User className="size-3.5 text-foreground/60" aria-hidden />
            </div>
            <span className="truncate text-[13px] font-medium text-foreground/70">
              {project.authorName}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2.5 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <Heart className="size-3" aria-hidden />
              {project.commentCount}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <Eye className="size-3" aria-hidden />
              {project.commentCount > 0 ? Math.round(project.commentCount * 28) : 0}
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

type CategoryCardProps = {
  slug: string;
  name: string;
  projectCount: number;
};

export function CategoryCard({ slug, name, projectCount }: CategoryCardProps) {
  const t = useTranslations("Home.categories");
  const Icon = isCategoryIconSlug(slug) ? categoryIcons[slug] : Code2;
  const dotColor = categoryColors[slug] ?? "bg-gray-400";

  return (
    <Link
      href={{ pathname: "/projects", query: { category: slug } }}
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-muted/50"
    >
      <span className={cn("size-2 shrink-0 rounded-full", dotColor)} aria-hidden />
      <span className="font-medium text-foreground">{name}</span>
      <span className="text-muted-foreground">({projectCount})</span>
    </Link>
  );
}

export function ProjectCardSkeleton({ view = "grid" }: { view?: ViewMode }) {
  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      <div className="flex items-center gap-1.5">
        <div className="size-5 animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 w-10 animate-pulse rounded bg-muted" />
        <div className="h-3 w-10 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="inline-flex h-10 w-32 animate-pulse rounded-full bg-muted" />
  );
}

// ViewToggle kept as a no-op export for backward compatibility
export function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}) {
  return null;
}
