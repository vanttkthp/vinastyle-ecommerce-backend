/*
  Warnings:

  - You are about to drop the column `sizeType` on the `product_variants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "sizeType";

-- CreateTable
CREATE TABLE "Size" (
    "sizeId" TEXT NOT NULL,
    "sizeType" "SizeType" NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("sizeId")
);

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("productVariantId") ON DELETE RESTRICT ON UPDATE CASCADE;
