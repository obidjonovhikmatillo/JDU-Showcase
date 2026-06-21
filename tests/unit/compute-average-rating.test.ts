import { describe, expect, it } from "vitest";

import { computeAverageRating } from "@/lib/restaurants/compute-average-rating";

describe("T018 average rating calculation", () => {
  it("returns null when there are no reviews", () => {
    expect(computeAverageRating([])).toBeNull();
  });

  it("calculates the arithmetic mean of review ratings", () => {
    expect(computeAverageRating([{ rating: 5 }, { rating: 3 }, { rating: 4 }])).toBe(4);
  });

  it("handles a single review", () => {
    expect(computeAverageRating([{ rating: 2 }])).toBe(2);
  });
});
