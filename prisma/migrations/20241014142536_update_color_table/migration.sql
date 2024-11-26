/*
  Warnings:

  - You are about to drop the column `colorId` on the `product_variants` table. All the data in the column will be lost.
  - Added the required column `productVariantId` to the `colors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_colorId_fkey";

-- AlterTable
ALTER TABLE "colors" ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "colorId";

-- AddForeignKey
ALTER TABLE "colors" ADD CONSTRAINT "colors_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("productVariantId") ON DELETE RESTRICT ON UPDATE CASCADE;
