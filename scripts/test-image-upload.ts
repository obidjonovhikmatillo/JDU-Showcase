import { validateImageFile } from "../lib/uploads/validate-image-file";
import { detectImageType } from "../lib/uploads/detect-image-type";
import { MAX_IMAGE_SIZE_BYTES } from "../lib/uploads/image-upload-constants";
import { createCommentImagesSchema } from "../lib/validations/uploaded-images-schema";

const checks: { name: string; ok: boolean }[] = [];

function assert(name: string, condition: boolean) {
  checks.push({ name, ok: condition });
  console.log(`${condition ? "PASS" : "FAIL"} - ${name}`);
}

function makeFile(name: string, type: string, size: number, content = "x") {
  const buffer = new Uint8Array(size);
  buffer.fill(content.charCodeAt(0));
  return new File([buffer], name, { type });
}

function main() {
  console.log("Running image upload validation checks...\n");

  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
  ]);
  const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]);
  const webpHeader = Buffer.from("RIFFxxxxWEBP", "ascii");

  assert("Detect PNG signature", detectImageType(pngHeader) === "png");
  assert("Detect JPEG signature", detectImageType(jpegHeader) === "jpeg");
  assert("Detect WebP signature", detectImageType(webpHeader) === "webp");
  assert("Reject unknown signature", detectImageType(Buffer.from("hello")) === null);

  assert(
    "Accept valid PNG file metadata",
    validateImageFile(makeFile("photo.png", "image/png", 1024)).ok,
  );
  assert(
    "Reject invalid file type",
    !validateImageFile(makeFile("photo.gif", "image/gif", 1024)).ok,
  );
  assert(
    "Reject oversized file",
    !validateImageFile(
      makeFile("photo.png", "image/png", MAX_IMAGE_SIZE_BYTES + 1),
    ).ok,
  );

  const commentSchema = createCommentImagesSchema((key) => key);
  assert(
    "Allow up to 4 comment images",
    commentSchema.safeParse([
      { url: "https://abc123.public.blob.vercel-storage.com/jdu-showcase/comments/a.jpg", publicId: "jdu-showcase/comments/a.jpg" },
      { url: "https://abc123.public.blob.vercel-storage.com/jdu-showcase/comments/b.jpg", publicId: "jdu-showcase/comments/b.jpg" },
      { url: "https://abc123.public.blob.vercel-storage.com/jdu-showcase/comments/c.jpg", publicId: "jdu-showcase/comments/c.jpg" },
      { url: "https://abc123.public.blob.vercel-storage.com/jdu-showcase/comments/d.jpg", publicId: "jdu-showcase/comments/d.jpg" },
    ]).success,
  );
  assert(
    "Reject more than 4 comment images",
    !commentSchema.safeParse(
      Array.from({ length: 5 }, (_, index) => ({
        url: `https://abc123.public.blob.vercel-storage.com/jdu-showcase/comments/${index}.jpg`,
        publicId: String(index),
      })),
    ).success,
  );
  assert(
    "Accept local dev upload URLs",
    commentSchema.safeParse([
      {
        url: "/uploads/jdu-showcase/comments/example.jpg",
        publicId: "jdu-showcase/comments/example",
      },
    ]).success,
  );
  assert(
    "Accept absolute localhost upload URLs",
    commentSchema.safeParse([
      {
        url: "http://localhost:3000/uploads/jdu-showcase/comments/example.jpg",
        publicId: "jdu-showcase/comments/example",
      },
    ]).success,
  );

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${checks.length} image validation checks passed.`);
}

main();
