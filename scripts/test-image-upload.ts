import { validateImageFile } from "../lib/uploads/validate-image-file";
import { detectImageType } from "../lib/uploads/detect-image-type";
import { MAX_IMAGE_SIZE_BYTES } from "../lib/uploads/image-upload-constants";
import { createReviewImagesSchema } from "../lib/validations/uploaded-images-schema";

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

  const reviewSchema = createReviewImagesSchema((key) => key);
  assert(
    "Allow up to 4 review images",
    reviewSchema.safeParse([
      { url: "https://res.cloudinary.com/demo/image/upload/a.jpg", publicId: "a" },
      { url: "https://res.cloudinary.com/demo/image/upload/b.jpg", publicId: "b" },
      { url: "https://res.cloudinary.com/demo/image/upload/c.jpg", publicId: "c" },
      { url: "https://res.cloudinary.com/demo/image/upload/d.jpg", publicId: "d" },
    ]).success,
  );
  assert(
    "Reject more than 4 review images",
    !reviewSchema.safeParse(
      Array.from({ length: 5 }, (_, index) => ({
        url: `https://res.cloudinary.com/demo/image/upload/${index}.jpg`,
        publicId: String(index),
      })),
    ).success,
  );
  assert(
    "Accept local dev upload URLs",
    reviewSchema.safeParse([
      {
        url: "/uploads/tasteguide/reviews/example.jpg",
        publicId: "tasteguide/reviews/example",
      },
    ]).success,
  );
  assert(
    "Accept absolute localhost upload URLs",
    reviewSchema.safeParse([
      {
        url: "http://localhost:3000/uploads/tasteguide/reviews/example.jpg",
        publicId: "tasteguide/reviews/example",
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
