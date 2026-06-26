export const MIN_COMMENT_RATING = 1;
export const MAX_COMMENT_RATING = 5;

export function isValidCommentRating(rating: number): boolean {
  return (
    Number.isInteger(rating) &&
    rating >= MIN_COMMENT_RATING &&
    rating <= MAX_COMMENT_RATING
  );
}
