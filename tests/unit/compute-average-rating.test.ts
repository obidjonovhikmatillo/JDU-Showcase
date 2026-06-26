import { describe, expect, it } from "vitest";

import { computeAverageRating } from "@/lib/projects/compute-average-rating";

describe("T018 average rating calculation", () => {
  it("returns null when there are no comments", () => {
    expect(computeAverageRating([])).toBeNull();
  });

  it("calculates the arithmetic mean of comment ratings", () => {
    expect(computeAverageRating([{ rating: 5 }, { rating: 3 }, { rating: 4 }])).toBe(4);
  });

  it("handles a single comment", () => {
    expect(computeAverageRating([{ rating: 2 }])).toBe(2);
  });
});
