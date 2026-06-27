import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { ProjectGalleryCarousel } from "@/components/projects/project-gallery-carousel";
import { ProjectDetailHeader } from "@/components/projects/project-detail-header";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { CommentSignInPrompt } from "@/components/comments/comment-sign-in-prompt";
import { AuthorCard } from "@/components/projects/author-card";
import { MoreByAuthor } from "@/components/projects/more-by-author";
import { auth } from "@/auth";
import { buildPageMetadata } from "@/lib/metadata";
import {
  getProjectDetailBySlug,
  getMoreProjectsByAuthor,
} from "@/lib/data/project-detail.server";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const project = await getProjectDetailBySlug(slug, locale);

  if (!project) {
    const t = await getTranslations("ProjectDetail");
    return { title: t("notFoundTitle") };
  }

  const description = project.description.slice(0, 160);

  return buildPageMetadata({
    title: project.title,
    description,
    locale,
    path: `/projects/${project.slug}`,
    imageUrl: project.mainImageUrl,
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const session = await auth();
  const t = await getTranslations("ProjectDetail");
  const project = await getProjectDetailBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const moreProjects = await getMoreProjectsByAuthor(
    project.authorName,
    project.slug,
    locale,
  );

  return (
    <div className="mx-auto max-w-[900px] space-y-10 px-4 py-8">
      <ProjectDetailHeader project={project} />

      <ProjectGalleryCarousel
        mainImageUrl={project.mainImageUrl}
        images={project.galleryImages}
        projectTitle={project.title}
      />

      <section className="space-y-4">
        <p className="text-base leading-relaxed text-foreground/80 sm:text-lg sm:leading-8">
          {project.description}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{t("aboutTitle")}</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          {t("aboutDescription")}
        </p>
      </section>

      <section className="space-y-6 border-t border-border pt-8">
        <h2 className="text-xl font-semibold text-foreground">
          {t("commentsTitle")} ({project.commentCount})
        </h2>
        {session?.user?.id ? (
          <CommentForm projectSlug={project.slug} />
        ) : (
          <CommentSignInPrompt projectSlug={project.slug} />
        )}
        <CommentList
          comments={project.comments}
          projectSlug={project.slug}
          viewer={
            session?.user?.id
              ? { id: session.user.id, role: session.user.role }
              : null
          }
        />
      </section>

      <AuthorCard
        authorName={project.authorName}
        department={project.department}
      />

      <MoreByAuthor
        authorName={project.authorName}
        projects={moreProjects}
      />
    </div>
  );
}
