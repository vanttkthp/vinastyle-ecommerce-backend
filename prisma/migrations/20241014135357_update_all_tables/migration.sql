/*
  Warnings:

  - You are about to drop the column `productId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `SKU` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `colorId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sizeType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `soldQuantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `wishlists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `wishlists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productVariantId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipmentId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productVariantId` to the `wishlists` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShipmentMethod" AS ENUM ('SHIPMENT', 'PICKUP', 'EXPRESS', 'COURIER');

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_orderId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_colorId_fkey";

-- DropForeignKey
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_orderId_fkey";

-- DropForeignKey
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_productId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "productId",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "shipmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "SKU",
DROP COLUMN "colorId",
DROP COLUMN "sizeType",
DROP COLUMN "soldQuantity",
DROP COLUMN "stock";

-- AlterTable
ALTER TABLE "shipments" DROP COLUMN "orderId",
ADD COLUMN     "shipmentMethod" "ShipmentMethod" NOT NULL DEFAULT 'SHIPMENT';

-- AlterTable
ALTER TABLE "wishlists" DROP COLUMN "productId",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "product_variants" (
    "productVariantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "sizeType" "SizeType" NOT NULL,
    "stock" INTEGER NOT NULL,
    "SKU" TEXT NOT NULL,
    "soldQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("productVariantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_userId_key" ON "wishlists"("userId");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("productVariantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("shipmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("paymentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("productVariantId") ON DELETE RESTRICT ON UPDATE CASCADE;
