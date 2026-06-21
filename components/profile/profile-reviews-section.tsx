"use client";

import { MessageSquareQuoteIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { ReviewDeleteDialog } from "@/components/reviews/review-delete-dialog";
import { ReviewEditDialog } from "@/components/reviews/review-edit-dialog";
import {
  formatRating,
  StarRating,
} from "@/components/restaurants/star-rating";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { ProfileReviewRecord } from "@/lib/data/profile.server";
import { cn } from "@/lib/utils";

type ProfileReviewItemProps = {
  review: ProfileReviewRecord;
};

function ProfileReviewItem({ review }: ProfileReviewItemProps) {
  const locale = useLocale();
  const t = useTranslations("ProfileReviews");
  const tList = useTranslations("ReviewList");
  const tActions = useTranslations("ReviewActions");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
            <div className="space-y-1">
              <Link
                href={`/restaurants/${review.restaurant.slug}`}
                className="font-medium text-foreground hover:underline"
              >
                {review.restaurant.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {t("submittedOn", { date: createdAt })}
              </p>
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
              {tList("visitedOn", { date: visitDate })}
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

      <ReviewEditDialog
        review={review}
        restaurantSlug={review.restaurant.slug}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ReviewDeleteDialog
        reviewId={review.id}
        restaurantSlug={review.restaurant.slug}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

type ProfileReviewsSectionProps = {
  reviews: ProfileReviewRecord[];
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
  const t = useTranslations("ProfileReviews");

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

export function ProfileReviewsSection({
  reviews,
  page,
  totalPages,
}: ProfileReviewsSectionProps) {
  const t = useTranslations("ProfileReviews");

  if (reviews.length === 0) {
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
          href="/restaurants"
          className={cn(buttonVariants(), "mt-6 inline-flex")}
        >
          {t("browseRestaurants")}
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
        {reviews.map((review) => (
          <ProfileReviewItem key={review.id} review={review} />
        ))}
      </div>
      <ProfilePagination page={page} totalPages={totalPages} />
    </section>
  );
}
