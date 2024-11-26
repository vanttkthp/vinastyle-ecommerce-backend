/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `images` table. All the data in the column will be lost.
  - Added the required column `colorId` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_productVariantId_fkey";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "productVariantId",
ADD COLUMN     "colorColorId" TEXT,
ADD COLUMN     "colorId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;
