-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_addressId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_shipmentId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "addressId" DROP NOT NULL,
ALTER COLUMN "paymentId" DROP NOT NULL,
ALTER COLUMN "shipmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("addressId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("shipmentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("paymentId") ON DELETE SET NULL ON UPDATE CASCADE;
