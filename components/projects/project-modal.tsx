"use client";

import {
  GlobeIcon,
  Loader2Icon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { StarRating, formatRating } from "@/components/projects/star-rating";
import { CommentItem } from "@/components/comments/comment-list-client";
import { LikeButton } from "@/components/projects/like-button";
import { SaveButton } from "@/components/projects/save-button";
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
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) {
      setProject(null);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    getProjectModalData(slug, locale)
      .then((data) => {
        if (cancelled) return;
        setLoading(false);
        if (data) {
          setProject(data);
          setActiveImageUrl(null);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  useEffect(() => {
    if (!slug) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [slug, onClose]);

  useEffect(() => {
    if (!slug) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [slug]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) onClose();
    },
    [onClose],
  );

  if (!slug) return null;

  const galleryUrls: string[] = [];
  if (project) {
    if (project.mainImageUrl) galleryUrls.push(project.mainImageUrl);
    for (const img of project.galleryImages) {
      if (!galleryUrls.includes(img.imageUrl)) galleryUrls.push(img.imageUrl);
    }
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/60 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={project?.title ?? t("loadingProject")}
    >
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain pt-10 sm:pt-14 lg:pt-16"
        onClick={handleBackdropClick}
      >
        <div
          className="relative mx-auto min-h-[calc(100vh-2.5rem)] w-full rounded-t-3xl bg-card shadow-2xl animate-in slide-in-from-bottom-6 fade-in duration-300 sm:min-h-0 lg:mb-8 lg:w-[calc(100%-4rem)] lg:max-w-[1000px] lg:rounded-2xl lg:border lg:border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 lg:hidden">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

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
                <Loader2Icon className="size-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t("loadingProject")}
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex min-h-[300px] items-center justify-center p-8">
              <div className="text-center">
                <p className="text-base text-muted-foreground">
                  {t("errorLoading")}
                </p>
                <Link
                  href={`/projects/${slug}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-4",
                  )}
                  onClick={onClose}
                >
                  {t("browseMore")}
                </Link>
              </div>
            </div>
          )}

          {project && !loading && (
            <div className="divide-y divide-border">
              {/* 1. Header: Like, Save + Project title + Author */}
              <div className="p-6 pr-14 sm:p-8 sm:pr-16">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      <UserIcon className="size-5 text-primary" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {project.authorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getCategoryLabel(project.category, locale)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <LikeButton
                      projectId={project.id}
                      initialLiked={project.isLiked}
                      likeCount={project.likeCount}
                    />
                    <SaveButton
                      projectId={project.id}
                      initialSaved={project.isSaved}
                    />
                  </div>
                </div>

                <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                  {project.title}
                </h2>
              </div>

              {/* 2. Project main image */}
              {(activeImageUrl ?? project.mainImageUrl) && (
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={activeImageUrl ?? project.mainImageUrl!}
                    alt={project.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 1000px) 100vw, 1000px"
                    priority
                  />
                </div>
              )}

              {/* Gallery thumbnails */}
              {galleryUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-4 sm:p-6">
                  {galleryUrls.map((url) => (
                    <button
                      type="button"
                      key={url}
                      onClick={() =>
                        setActiveImageUrl(
                          url === project.mainImageUrl ? null : url,
                        )
                      }
                      className={cn(
                        "relative size-20 shrink-0 overflow-hidden rounded-lg border-2 sm:size-24 transition",
                        (url === project.mainImageUrl && !activeImageUrl) ||
                          activeImageUrl === url
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <Image
                        src={url}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* 3. Description (5 lines, project-specific) */}
              <div className="space-y-5 p-6 sm:p-8">
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

                <p className="max-w-3xl text-[15px] leading-relaxed text-foreground/80 sm:text-base sm:leading-7">
                  {project.description}
                </p>

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
              </div>

              {/* 4. Comments */}
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
              </div>

              {/* 5. More by author */}
              {project.moreByAuthor.length > 0 && (
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">
                      {t("moreByAuthor", { author: project.authorName })}
                    </h3>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-sm font-medium text-primary hover:underline"
                      onClick={onClose}
                    >
                      {t("viewAll")}
                    </Link>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {project.moreByAuthor.map((related) => (
                      <button
                        key={related.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            window.dispatchEvent(
                              new CustomEvent("open-project-modal", {
                                detail: { slug: related.slug },
                              }),
                            );
                          }, 150);
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
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Get in touch - Author card */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                    <UserIcon className="size-10 text-primary" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">
                    {project.authorName}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.department} ·{" "}
                    {getCategoryLabel(project.category, locale)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MailIcon className="size-3.5" aria-hidden />
                      {project.authorName.toLowerCase().replace(/\s+/g, ".")}@jdu.uz
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <PhoneIcon className="size-3.5" aria-hidden />
                      +998 90 123 45 67
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <GlobeIcon className="size-3.5" aria-hidden />
                      jdu.uz
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "rounded-full px-8",
                      )}
                    >
                      <MailIcon className="mr-2 size-4" aria-hidden />
                      {t("getInTouch")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
