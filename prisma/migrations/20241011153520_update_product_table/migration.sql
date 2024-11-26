/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `productVariantId` on the `wishlists` table. All the data in the column will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SKU` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeType` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `wishlists` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GenderCategory" AS ENUM ('MALE', 'FEMALE', 'UNISEX', 'LADIES', 'GENT');

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_colorId_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_productId_fkey";

-- DropForeignKey
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_productVariantId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "productVariantId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "SKU" TEXT NOT NULL,
ADD COLUMN     "colorId" TEXT NOT NULL,
ADD COLUMN     "genderCategory" "GenderCategory" NOT NULL DEFAULT 'UNISEX',
ADD COLUMN     "sizeType" "SizeType" NOT NULL,
ADD COLUMN     "soldQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stock" INTEGER NOT NULL,
ADD COLUMN     "subCategoryId" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "wishlists" DROP COLUMN "productVariantId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "product_variants";

-- CreateTable
CREATE TABLE "sub_categories" (
    "subCategoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("subCategoryId")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("subCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
