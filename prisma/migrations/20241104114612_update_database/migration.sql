/*
  Warnings:

  - You are about to drop the column `addressId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `orders` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `shipments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_addressId_fkey";

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "addressId",
DROP COLUMN "sessionId",
ALTER COLUMN "totalPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "shipments" ADD COLUMN     "addressId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;
