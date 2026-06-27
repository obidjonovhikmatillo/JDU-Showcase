"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { CommentDeleteDialog } from "@/components/comments/comment-delete-dialog";
import { CommentEditDialog } from "@/components/comments/comment-edit-dialog";
import {
  formatRating,
  StarRating,
} from "@/components/projects/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { canManageComment } from "@/lib/comments/permissions";
import type {
  CommentViewer,
  SerializedCommentRecord,
} from "@/lib/comments/comment-serialization";

type CommentItemProps = {
  comment: SerializedCommentRecord;
  projectSlug: string;
  viewer: CommentViewer | null;
};

export function CommentItem({ comment, projectSlug, viewer }: CommentItemProps) {
  const locale = useLocale();
  const t = useTranslations("CommentList");
  const tActions = useTranslations("CommentActions");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canManage = canManageComment(viewer, comment.user.id);

  const createdAt = new Date(comment.createdAt).toLocaleDateString("en-CA");

  return (
    <>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">{comment.user.fullName}</p>
              <p className="text-xs text-muted-foreground">{createdAt}</p>
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

          {canManage ? (
            <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
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
          ) : null}
        </CardContent>
      </Card>

      {canManage ? (
        <>
          <CommentEditDialog
            comment={comment}
            projectSlug={projectSlug}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <CommentDeleteDialog
            commentId={comment.id}
            projectSlug={projectSlug}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      ) : null}
    </>
  );
}

type CommentListClientProps = {
  comments: SerializedCommentRecord[];
  projectSlug: string;
  viewer: CommentViewer | null;
};

export function CommentListClient({
  comments,
  projectSlug,
  viewer,
}: CommentListClientProps) {
  const t = useTranslations("CommentList");

  if (comments.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
        <h2 className="text-lg font-semibold text-foreground">{t("emptyTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("emptyDescription")}</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">
        {t("title", { count: comments.length })}
      </h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            projectSlug={projectSlug}
            viewer={viewer}
          />
        ))}
      </div>
    </section>
  );
}
