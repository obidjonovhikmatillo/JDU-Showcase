import type { Role } from "@prisma/client";

import { ReviewListClient } from "@/components/reviews/review-list-client";
import type { ReviewRecord } from "@/lib/data/review-types";
import { serializeReviewForClient } from "@/lib/reviews/review-serialization";

type ReviewListProps = {
  reviews: ReviewRecord[];
  restaurantSlug: string;
  viewer: { id: string; role: Role } | null;
};

export function ReviewList({ reviews, restaurantSlug, viewer }: ReviewListProps) {
  const serializedReviews = reviews.map(serializeReviewForClient);

  return (
    <ReviewListClient
      reviews={serializedReviews}
      restaurantSlug={restaurantSlug}
      viewer={viewer}
    />
  );
}
