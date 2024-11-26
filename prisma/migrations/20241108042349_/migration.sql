/*
  Warnings:

  - Added the required column `totalAmount` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "City" AS ENUM ('HANOI', 'HAIPHONG', 'THANHHOA', 'NAMDINH');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;
