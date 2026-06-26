import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ProjectAdminForm } from "@/components/admin/project-admin-form";
import { PageHeader } from "@/components/layout/page-shell";
import {
  getAdminProjectForEdit,
  listAdminCategoryOptions,
} from "@/lib/data/admin-projects.server";

type EditProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: EditProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getAdminProjectForEdit(slug);
  const t = await getTranslations("AdminProjectForm");

  return {
    title: project ? t("editPageTitle", { name: project.title }) : t("notFound"),
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { slug } = await params;
  const [project, categories, t] = await Promise.all([
    getAdminProjectForEdit(slug),
    listAdminCategoryOptions(),
    getTranslations("AdminProjectForm"),
  ]);

  if (!project) {
    notFound();
  }

  const initialMainImage = project.mainImageUrl
    ? {
        url: project.mainImageUrl,
        publicId: project.mainImagePublicId ?? undefined,
      }
    : null;

  const initialGalleryImages = project.images.map((image) => ({
    id: image.id,
    url: image.imageUrl,
    publicId: image.publicId ?? undefined,
  }));

  return (
    <section className="space-y-6">
      <PageHeader
        title={t("editPageTitle", { name: project.title })}
        subtitle={t("editPageSubtitle")}
      />
      <ProjectAdminForm
        mode="edit"
        categories={categories}
        initialValues={{
          projectId: project.id,
          slug: project.slug,
          title: project.title,
          description: project.descriptionEn,
          authorName: project.authorName,
          department: project.department,
          demoUrl: project.demoUrl ?? "",
          githubUrl: project.githubUrl ?? "",
          techStack: project.techStack ?? "",
          difficulty: project.difficulty ?? "",
          categoryId: project.categoryId,
          isPublished: project.isPublished,
        }}
        initialMainImage={initialMainImage}
        initialGalleryImages={initialGalleryImages}
      />
    </section>
  );
}
