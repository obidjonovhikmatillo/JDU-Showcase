/**
 * Utility functions for project ratings and display.
 * (Price-level logic removed during migration from restaurant app.)
 */

export function isGuestFavorite(
  averageRating: number | null,
  commentCount: number,
): boolean {
  return averageRating !== null && averageRating >= 4.7 && commentCount >= 3;
}

export function computeRatingDistribution(ratings: number[]): number[] {
  const distribution = [0, 0, 0, 0, 0];

  for (const rating of ratings) {
    if (rating >= 1 && rating <= 5) {
      distribution[rating - 1] += 1;
    }
  }

  return distribution;
}
