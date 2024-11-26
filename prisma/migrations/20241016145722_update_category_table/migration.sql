/*
  Warnings:

  - You are about to drop the column `genderCategory` on the `products` table. All the data in the column will be lost.
  - Added the required column `forFeMale` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forMale` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unisex` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "forFeMale" BOOLEAN NOT NULL,
ADD COLUMN     "forMale" BOOLEAN NOT NULL,
ADD COLUMN     "unisex" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "total" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "genderCategory";

-- DropEnum
DROP TYPE "GenderCategory";
