"use client";

import { MessageSquareQuoteIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { CommentDeleteDialog } from "@/components/comments/comment-delete-dialog";
import { CommentEditDialog } from "@/components/comments/comment-edit-dialog";
import {
  formatRating,
  StarRating,
} from "@/components/projects/star-rating";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { ProfileCommentRecord } from "@/lib/data/profile.server";
import { cn } from "@/lib/utils";

type ProfileCommentItemProps = {
  comment: ProfileCommentRecord;
};

function ProfileCommentItem({ comment }: ProfileCommentItemProps) {
  const locale = useLocale();
  const t = useTranslations("ProfileComments");
  const tList = useTranslations("CommentList");
  const tActions = useTranslations("CommentActions");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const createdAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(comment.createdAt));

  return (
    <>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <Link
                href={`/projects/${comment.project.slug}`}
                className="font-medium text-foreground hover:underline"
              >
                {comment.project.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {t("submittedOn", { date: createdAt })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={comment.rating} size="md" />
              <span className="text-sm font-medium text-foreground">
                {formatRating(comment.rating)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">{comment.title}</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {comment.content}
            </p>
          </div>

          {comment.images.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {comment.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-video overflow-hidden rounded-lg border border-border/60"
                >
                  <Image
                    src={image.imageUrl}
                    alt={comment.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <PencilIcon className="size-4" aria-hidden />
              {tActions("edit")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2Icon className="size-4" aria-hidden />
              {tActions("delete")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <CommentEditDialog
        comment={comment}
        projectSlug={comment.project.slug}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <CommentDeleteDialog
        commentId={comment.id}
        projectSlug={comment.project.slug}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

type ProfileCommentsSectionProps = {
  comments: ProfileCommentRecord[];
  page: number;
  totalPages: number;
};

function ProfilePagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const t = useTranslations("ProfileComments");

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <p className="text-sm text-muted-foreground">
        {t("pageOf", { page, totalPages })}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={page === 2 ? "/profile" : `/profile?page=${page - 1}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            {t("previous")}
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("previous")}
          </Button>
        )}
        {page < totalPages ? (
          <Link
            href={`/profile?page=${page + 1}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            {t("next")}
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            {t("next")}
          </Button>
        )}
      </div>
    </div>
  );
}

export function ProfileCommentsSection({
  comments,
  page,
  totalPages,
}: ProfileCommentsSectionProps) {
  const t = useTranslations("ProfileComments");

  if (comments.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
          <MessageSquareQuoteIcon className="size-6 text-muted-foreground" aria-hidden />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-foreground">{t("emptyTitle")}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {t("emptyDescription")}
        </p>
        <Link
          href="/projects"
          className={cn(buttonVariants(), "mt-6 inline-flex")}
        >
          {t("browseProjects")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
      </div>
      <div className="space-y-4">
        {comments.map((comment) => (
          <ProfileCommentItem key={comment.id} comment={comment} />
        ))}
      </div>
      <ProfilePagination page={page} totalPages={totalPages} />
    </section>
  );
}
