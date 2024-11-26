/*
  Warnings:

  - You are about to drop the `Size` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_sizeId_fkey";

-- DropTable
DROP TABLE "Size";

-- CreateTable
CREATE TABLE "sizes" (
    "sizeId" TEXT NOT NULL,
    "sizeType" "SizeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("sizeId")
);

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "sizes"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;
