import { describe, expect, it } from "vitest";

import { validateImageFile } from "@/lib/uploads/validate-image-file";
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/uploads/image-upload-constants";

function createFile(name: string, type: string, size: number) {
  const buffer = new Uint8Array(size);
  return new File([buffer], name, { type });
}

describe("T017 image validation", () => {
  it("accepts a valid PNG file", () => {
    const file = createFile("photo.png", "image/png", 1024);
    expect(validateImageFile(file)).toEqual({ ok: true });
  });

  it("rejects files larger than 5 MB", () => {
    const file = createFile("large.jpg", "image/jpeg", MAX_IMAGE_SIZE_BYTES + 1);
    expect(validateImageFile(file)).toEqual({ ok: false, code: "imageTooLarge" });
  });

  it("rejects unsupported file types", () => {
    const file = createFile("document.pdf", "application/pdf", 512);
    expect(validateImageFile(file)).toEqual({ ok: false, code: "imageInvalidType" });
  });

  it("rejects empty files", () => {
    const file = createFile("empty.png", "image/png", 0);
    expect(validateImageFile(file)).toEqual({ ok: false, code: "imageRequired" });
  });
});
