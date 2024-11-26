/*
  Warnings:

  - You are about to drop the column `price` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "images" (
    "imageId" TEXT NOT NULL,
    "keypointLocation" TEXT NOT NULL,
    "descriptor" BYTEA NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("imageId")
);

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("productVariantId") ON DELETE RESTRICT ON UPDATE CASCADE;
