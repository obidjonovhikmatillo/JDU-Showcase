export function computeAverageRating(comments: { rating: number }[]): number | null {
  if (comments.length === 0) {
    return null;
  }

  const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
  return total / comments.length;
}
