"use client";

import {
  BookmarkIcon,
  ExternalLinkIcon,
  CodeIcon,
  HeartIcon,
  Loader2Icon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { StarRating, formatRating } from "@/components/projects/star-rating";
import { CommentItem } from "@/components/comments/comment-list-client";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getCategoryLabel } from "@/lib/categories";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  getProjectModalData,
  type ProjectModalData,
} from "@/lib/actions/project-modal-data";
import { FALLBACK_PROJECT_IMAGE } from "@/lib/project-images";

type ProjectModalProps = {
  slug: string | null;
  onClose: () => void;
};

export function ProjectModal({ slug, onClose }: ProjectModalProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("ProjectDetail");
  const [project, setProject] = useState<ProjectModalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch project data when slug changes
  useEffect(() => {
    if (!slug) {
      setProject(null);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    getProjectModalData(slug, locale).then((data) => {
      if (cancelled) return;
      setLoading(false);
      if (data) {
        setProject(data);
      } else {
        setError(true);
      }
    }).catch(() => {
      if (cancelled) return;
      setLoading(false);
      setError(true);
    });

    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  // Close on Escape key
  useEffect(() => {
    if (!slug) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [slug, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!slug) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [slug]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  if (!slug) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 pt-10 animate-in fade-in duration-200 sm:pt-14 lg:pt-16"
      role="dialog"
      aria-modal="true"
      aria-label={project?.title ?? t("loadingProject")}
    >
      <div
        ref={contentRef}
        className="relative mx-auto min-h-[calc(100vh-2.5rem)] w-full rounded-t-3xl bg-card shadow-2xl animate-in slide-in-from-bottom-6 fade-in duration-300 sm:min-h-[calc(100vh-3.5rem)] lg:min-h-0 lg:w-[calc(100%-4rem)] lg:max-w-[1100px] lg:rounded-2xl lg:border lg:border-border"
      >
        {/* Drag indicator */}
        <div className="flex justify-center pt-3 lg:hidden">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground/70 shadow-sm backdrop-blur-sm transition hover:bg-background hover:text-foreground"
          aria-label={t("closeModal")}
        >
          <XIcon className="size-5" aria-hidden />
        </button>

        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2Icon className="size-8 animate-spin text-[#0057ff]" />
              <p className="text-sm text-muted-foreground">{t("loadingProject")}</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex min-h-[300px] items-center justify-center p-8">
            <div className="text-center">
              <p className="text-base text-muted-foreground">{t("errorLoading")}</p>
              <Link
                href={`/projects/${slug}`}
                className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
                onClick={onClose}
              >
                {t("browseMore")}
              </Link>
            </div>
          </div>
        )}

        {project && !loading && (
          <div className="divide-y divide-border">
            {/* Header: title, author, actions */}
            <div className="p-6 pb-5 pr-14 sm:p-8 sm:pb-6 sm:pr-16">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                {project.title}
              </h2>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#0057ff]/10">
                    <UserIcon className="size-4 text-[#0057ff]" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{project.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {getCategoryLabel(project.category, locale)}
                    </p>
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
            </div>

            {/* Project image */}
            {project.mainImageUrl && (
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                  src={project.mainImageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  priority
                />
              </div>
            )}

            {/* Gallery thumbnails */}
            {project.galleryImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto p-4 sm:p-6">
                {project.galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border sm:size-24"
                  >
                    <Image
                      src={img.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description + Tech stack */}
            <div className="space-y-5 p-6 sm:p-8">
              {/* Rating */}
              {project.averageRating !== null && (
                <div className="flex items-center gap-2">
                  <StarRating rating={project.averageRating} size="md" />
                  <span className="text-base font-semibold text-foreground">
                    {formatRating(project.averageRating)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("commentCount", { count: project.commentCount })}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground">{t("aboutTitle")}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {project.description}
                </p>
              </div>

              {project.techStack && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("techStack")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.techStack.split(",").map((tech) => (
                      <span
                        key={tech.trim()}
                        className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action links */}
              <div className="flex flex-wrap gap-2">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ size: "lg" }), "rounded-full bg-[#0057ff] hover:bg-[#0046cc]")}
                  >
                    <ExternalLinkIcon className="mr-2 size-4" aria-hidden />
                    {t("liveDemo")}
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full")}
                  >
                    <CodeIcon className="mr-2 size-4" aria-hidden />
                    {t("sourceCode")}
                  </a>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-foreground">
                {t("commentsTitle")} ({project.commentCount})
              </h3>
              {project.comments.length > 0 ? (
                <div className="space-y-3">
                  {project.comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      projectSlug={project.slug}
                      viewer={null}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("browseMore")}
                </p>
              )}

              {/* Link to full page for comment form */}
              <Link
                href={`/projects/${project.slug}`}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                onClick={onClose}
              >
                {t("browseMore")}
              </Link>
            </div>

            {/* More by author */}
            {project.moreByAuthor.length > 0 && (
              <div className="p-6 sm:p-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  {t("moreByAuthor", { author: project.authorName })}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {project.moreByAuthor.map((related) => (
                    <button
                      key={related.id}
                      type="button"
                      onClick={() => {
                        // Navigate to related project's modal by triggering a slug change
                        // We close current and the parent will re-open with new slug
                        onClose();
                        // Small delay to allow modal to close before reopening
                        setTimeout(() => {
                          window.dispatchEvent(
                            new CustomEvent("open-project-modal", {
                              detail: { slug: related.slug },
                            })
                          );
                        }, 100);
                      }}
                      className="group text-left"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted transition group-hover:shadow-md">
                        <Image
                          src={related.mainImageUrl ?? FALLBACK_PROJECT_IMAGE}
                          alt={related.title}
                          fill
                          className="object-cover transition group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                      <p className="mt-2 truncate text-sm font-medium text-foreground">
                        {related.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
