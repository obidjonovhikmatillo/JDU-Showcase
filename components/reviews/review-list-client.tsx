"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { ReviewDeleteDialog } from "@/components/reviews/review-delete-dialog";
import { ReviewEditDialog } from "@/components/reviews/review-edit-dialog";
import {
  formatRating,
  StarRating,
} from "@/components/restaurants/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { canManageReview } from "@/lib/reviews/permissions";
import type {
  ReviewViewer,
  SerializedReviewRecord,
} from "@/lib/reviews/review-serialization";

type ReviewItemProps = {
  review: SerializedReviewRecord;
  restaurantSlug: string;
  viewer: ReviewViewer | null;
};

export function ReviewItem({ review, restaurantSlug, viewer }: ReviewItemProps) {
  const locale = useLocale();
  const t = useTranslations("ReviewList");
  const tActions = useTranslations("ReviewActions");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canManage = canManageReview(viewer, review.user.id);

  const visitDate = review.visitDate
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
        new Date(review.visitDate),
      )
    : null;
  const createdAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(review.createdAt));

  return (
    <>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">{review.user.fullName}</p>
              <p className="text-xs text-muted-foreground">{createdAt}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={review.rating} size="md" />
              <span className="text-sm font-medium text-foreground">
                {formatRating(review.rating)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground">{review.title}</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {review.content}
            </p>
          </div>

          {visitDate ? (
            <p className="text-xs text-muted-foreground">
              {t("visitedOn", { date: visitDate })}
            </p>
          ) : null}

          {review.images.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {review.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-video overflow-hidden rounded-lg border border-border/60"
                >
                  <Image
                    src={image.imageUrl}
                    alt={review.title}
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
          <ReviewEditDialog
            review={review}
            restaurantSlug={restaurantSlug}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <ReviewDeleteDialog
            reviewId={review.id}
            restaurantSlug={restaurantSlug}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      ) : null}
    </>
  );
}

type ReviewListClientProps = {
  reviews: SerializedReviewRecord[];
  restaurantSlug: string;
  viewer: ReviewViewer | null;
};

export function ReviewListClient({
  reviews,
  restaurantSlug,
  viewer,
}: ReviewListClientProps) {
  const t = useTranslations("ReviewList");

  if (reviews.length === 0) {
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
        {t("title", { count: reviews.length })}
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            restaurantSlug={restaurantSlug}
            viewer={viewer}
          />
        ))}
      </div>
    </section>
  );
}
