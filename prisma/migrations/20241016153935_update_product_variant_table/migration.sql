/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `colors` table. All the data in the column will be lost.
  - Added the required column `colorId` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `product_variants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Size" DROP CONSTRAINT "Size_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "colors" DROP CONSTRAINT "colors_productVariantId_fkey";

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "productVariantId";

-- AlterTable
ALTER TABLE "colors" DROP COLUMN "productVariantId";

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "colorId" TEXT NOT NULL,
ADD COLUMN     "sizeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;
