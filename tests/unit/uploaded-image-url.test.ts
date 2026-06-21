import { describe, expect, it } from "vitest";

import {
  isValidUploadedImageUrl,
  normalizeImageSrcForDisplay,
} from "@/lib/uploads/uploaded-image-url";

describe("uploaded image URL helpers", () => {
  it("accepts local upload paths and cloud URLs", () => {
    expect(isValidUploadedImageUrl("/uploads/tasteguide/reviews/abc.jpg")).toBe(true);
    expect(isValidUploadedImageUrl("https://abc123.public.blob.vercel-storage.com/demo.jpg")).toBe(true);
    expect(isValidUploadedImageUrl("not-a-url")).toBe(false);
  });

  it("normalizes absolute localhost URLs to relative upload paths", () => {
    expect(
      normalizeImageSrcForDisplay("http://localhost:3000/uploads/tasteguide/avatars/a.jpg"),
    ).toBe("/uploads/tasteguide/avatars/a.jpg");
  });
});
