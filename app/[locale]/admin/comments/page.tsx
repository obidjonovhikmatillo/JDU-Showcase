import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearchBar } from "@/components/admin/admin-search-bar";
import { AdminCommentsClient } from "@/components/admin/admin-comments-client";
import { PageHeader } from "@/components/layout/page-shell";
import {
  listAdminCommentProjectOptions,
  listAdminCommentsPaginated,
} from "@/lib/data/admin-comments.server";
import { serializeCommentForClient } from "@/lib/comments/comment-serialization";
import { parseOptionalInt, parseSearchParam } from "@/lib/admin/pagination";
import prisma from "@/lib/prisma";

type AdminCommentsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AdminComments");
  return { title: t("title") };
}

export default async function AdminCommentsPage({ searchParams }: AdminCommentsPageProps) {
  const params = await searchParams;
  const q = parseSearchParam(params.q);
  const projectParam = parseSearchParam(params.projectId);
  const projectId =
    projectParam && projectParam !== "all" ? projectParam : undefined;
  const ratingParam = parseOptionalInt(params.rating);
  const rating = ratingParam && ratingParam >= 1 && ratingParam <= 5 ? ratingParam : undefined;
  const page = parseOptionalInt(params.page) ?? 1;

  const [result, projects, t, tCommon] = await Promise.all([
    listAdminCommentsPaginated({ q, page, projectId, rating }),
    listAdminCommentProjectOptions(),
    getTranslations("AdminComments"),
    getTranslations("AdminCommon"),
  ]);

  const commentIds = result.items.map((item) => item.id);
  const commentImages = commentIds.length
    ? await prisma.commentImage.findMany({
        where: { commentId: { in: commentIds } },
        select: { id: true, commentId: true, imageUrl: true, publicId: true },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const imagesByComment = commentImages.reduce<
    Record<string, { id: string; imageUrl: string; publicId: string | null }[]>
  >((acc, image) => {
    acc[image.commentId] ??= [];
    acc[image.commentId].push(image);
    return acc;
  }, {});

  const comments = result.items.map((item) => ({
    ...serializeCommentForClient({
      id: item.id,
      rating: item.rating,
      title: item.title,
      content: item.content,
      createdAt: item.createdAt,
      user: item.user,
      images: imagesByComment[item.id] ?? [],
    }),
    projectSlug: item.project.slug,
    projectTitle: item.project.title,
  }));

  return (
    <section className="space-y-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <AdminSearchBar
        action="/admin/comments"
        searchLabel={t("searchLabel")}
        searchPlaceholder={t("searchPlaceholder")}
        submitLabel={tCommon("applyFilters")}
        defaultQuery={q}
        filters={[
          {
            name: "projectId",
            label: t("projectFilter"),
            defaultValue: projectParam ?? "all",
            options: [
              { value: "all", label: t("allProjects") },
              ...projects.map((project) => ({
                value: project.id,
                label: project.title,
              })),
            ],
          },
          {
            name: "rating",
            label: t("ratingFilter"),
            defaultValue: rating ? String(rating) : "all",
            options: [
              { value: "all", label: t("allRatings") },
              ...Array.from({ length: 5 }, (_, index) => ({
                value: String(index + 1),
                label: t("ratingOption", { rating: index + 1 }),
              })),
            ],
          },
        ]}
      />

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <AdminCommentsClient comments={comments} />
      )}

      <AdminPagination
        page={result.page}
        totalPages={result.totalPages}
        basePath="/admin/comments"
        searchParams={{
          q,
          projectId: projectParam && projectParam !== "all" ? projectParam : undefined,
          rating: rating ? String(rating) : undefined,
        }}
      />
    </section>
  );
}
