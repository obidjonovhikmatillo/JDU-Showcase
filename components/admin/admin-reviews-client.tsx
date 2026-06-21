"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ReviewDeleteDialog } from "@/components/reviews/review-delete-dialog";
import { ReviewEditDialog } from "@/components/reviews/review-edit-dialog";
import { Button } from "@/components/ui/button";
import type { SerializedReviewRecord } from "@/lib/reviews/review-serialization";

export type AdminReviewListItem = SerializedReviewRecord & {
  restaurantSlug: string;
  restaurantName: string;
};

type AdminReviewsClientProps = {
  reviews: AdminReviewListItem[];
};

export function AdminReviewsClient({ reviews }: AdminReviewsClientProps) {
  const router = useRouter();
  const t = useTranslations("AdminReviews");
  const [editingReview, setEditingReview] = useState<AdminReviewListItem | null>(null);
  const [deletingReview, setDeletingReview] = useState<AdminReviewListItem | null>(null);

  return (
    <>
      <div className="space-y-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-xl border border-border/60 bg-card p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{review.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("meta", {
                    author: review.user.fullName,
                    restaurant: review.restaurantName,
                    rating: review.rating,
                    images: review.images.length,
                  })}
                </p>
                <p className="line-clamp-2 text-sm">{review.content}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setEditingReview(review)}>
                  {t("edit")}
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => setDeletingReview(review)}>
                  {t("delete")}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editingReview ? (
        <ReviewEditDialog
          review={editingReview}
          restaurantSlug={editingReview.restaurantSlug}
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditingReview(null);
              router.refresh();
            }
          }}
        />
      ) : null}

      {deletingReview ? (
        <ReviewDeleteDialog
          reviewId={deletingReview.id}
          restaurantSlug={deletingReview.restaurantSlug}
          open
          onOpenChange={(open) => {
            if (!open) {
              setDeletingReview(null);
              router.refresh();
            }
          }}
        />
      ) : null}
    </>
  );
}
