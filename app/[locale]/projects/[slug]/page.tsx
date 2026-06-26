import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { ProjectGalleryCarousel } from "@/components/projects/project-gallery-carousel";
import {
  ProjectDetailHeader,
  ProjectInfoCard,
} from "@/components/projects/project-detail-header";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { CommentSignInPrompt } from "@/components/comments/comment-sign-in-prompt";
import { auth } from "@/auth";
import { buildPageMetadata } from "@/lib/metadata";
import { getProjectDetailBySlug } from "@/lib/data/project-detail.server";

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

  return (
    <div className="mx-auto max-w-[1100px] space-y-8 px-4 py-8">
      <ProjectDetailHeader project={project} />

      <ProjectGalleryCarousel
        mainImageUrl={project.mainImageUrl}
        images={project.galleryImages}
        projectTitle={project.title}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">{t("aboutTitle")}</h2>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </section>

          <section className="space-y-6 border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground">{t("commentsTitle")}</h2>
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
        </div>

        <ProjectInfoCard project={project} />
      </div>
    </div>
  );
}
