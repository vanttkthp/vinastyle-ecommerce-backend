/*
  Warnings:

  - The `name` column on the `colors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hexCode` column on the `colors` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "colors" DROP COLUMN "name",
ADD COLUMN     "name" TEXT[],
DROP COLUMN "hexCode",
ADD COLUMN     "hexCode" TEXT[];
