-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "mainImagePublicId" TEXT;

-- AlterTable
ALTER TABLE "restaurant_images" ADD COLUMN IF NOT EXISTS "publicId" TEXT;

-- AlterTable
ALTER TABLE "review_images" ADD COLUMN IF NOT EXISTS "publicId" TEXT;
