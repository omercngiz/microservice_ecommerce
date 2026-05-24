/*
  Warnings:

  - Changed the type of `images` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable: Convert images from TEXT[] to JSONB, preserving existing data
ALTER TABLE "Product" ADD COLUMN "images_new" JSONB;
UPDATE "Product" SET "images_new" = to_jsonb("images");
ALTER TABLE "Product" DROP COLUMN "images";
ALTER TABLE "Product" RENAME COLUMN "images_new" TO "images";
ALTER TABLE "Product" ALTER COLUMN "images" SET NOT NULL;
