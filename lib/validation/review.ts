export const MIN_REVIEW_RATING = 1;
export const MAX_REVIEW_RATING = 5;

export function isValidReviewRating(rating: number): boolean {
  return (
    Number.isInteger(rating) &&
    rating >= MIN_REVIEW_RATING &&
    rating <= MAX_REVIEW_RATING
  );
}
