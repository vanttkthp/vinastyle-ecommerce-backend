-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MOMO', 'ZALO', 'COD');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD';
