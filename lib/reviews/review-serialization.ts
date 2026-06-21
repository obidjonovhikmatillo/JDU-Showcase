import type { Role } from "@prisma/client";

import type { ReviewAuthor, ReviewImageRecord } from "@/lib/data/review-types";

export type SerializedReviewRecord = {
  id: string;
  rating: number;
  title: string;
  content: string;
  visitDate: string | null;
  createdAt: string;
  user: ReviewAuthor;
  images: ReviewImageRecord[];
};

export type ReviewViewer = {
  id: string;
  role: Role;
};

export function serializeReviewForClient(review: {
  id: string;
  rating: number;
  title: string;
  content: string;
  visitDate: Date | null;
  createdAt: Date;
  user: ReviewAuthor;
  images: ReviewImageRecord[];
}): SerializedReviewRecord {
  return {
    id: review.id,
    rating: review.rating,
    title: review.title,
    content: review.content,
    visitDate: review.visitDate ? review.visitDate.toISOString() : null,
    createdAt: review.createdAt.toISOString(),
    user: review.user,
    images: review.images,
  };
}

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) {
    return todayInputValue();
  }

  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

export function todayInputValue() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
}
