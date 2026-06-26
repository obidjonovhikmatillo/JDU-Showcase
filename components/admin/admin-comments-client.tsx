"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { CommentDeleteDialog } from "@/components/comments/comment-delete-dialog";
import { CommentEditDialog } from "@/components/comments/comment-edit-dialog";
import { Button } from "@/components/ui/button";
import type { SerializedCommentRecord } from "@/lib/comments/comment-serialization";

export type AdminCommentListItem = SerializedCommentRecord & {
  projectSlug: string;
  projectTitle: string;
};

type AdminCommentsClientProps = {
  comments: AdminCommentListItem[];
};

export function AdminCommentsClient({ comments }: AdminCommentsClientProps) {
  const router = useRouter();
  const t = useTranslations("AdminComments");
  const [editingComment, setEditingComment] = useState<AdminCommentListItem | null>(null);
  const [deletingComment, setDeletingComment] = useState<AdminCommentListItem | null>(null);

  return (
    <>
      <div className="space-y-3">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-xl border border-border/60 bg-card p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{comment.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("meta", {
                    author: comment.user.fullName,
                    project: comment.projectTitle,
                    rating: comment.rating,
                    images: comment.images.length,
                  })}
                </p>
                <p className="line-clamp-2 text-sm">{comment.content}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setEditingComment(comment)}>
                  {t("edit")}
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => setDeletingComment(comment)}>
                  {t("delete")}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editingComment ? (
        <CommentEditDialog
          comment={editingComment}
          projectSlug={editingComment.projectSlug}
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditingComment(null);
              router.refresh();
            }
          }}
        />
      ) : null}

      {deletingComment ? (
        <CommentDeleteDialog
          commentId={deletingComment.id}
          projectSlug={deletingComment.projectSlug}
          open
          onOpenChange={(open) => {
            if (!open) {
              setDeletingComment(null);
              router.refresh();
            }
          }}
        />
      ) : null}
    </>
  );
}
