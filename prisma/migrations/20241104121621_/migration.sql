/*
  Warnings:

  - Added the required column `imageURL` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "imageURL" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
