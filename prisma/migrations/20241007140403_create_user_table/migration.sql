-- CreateEnum
CREATE TYPE "Gender" AS
    ENUM ('MALE', 'FEMALE', 'OTHER');
 
    -- CreateTable
    CREATE TABLE "users" ( "userId" TEXT NOT NULL, "email" TEXT NOT NULL, "firstName" TEXT, "lastName" TEXT, "password" TEXT NOT NULL, "phoneNumber" TEXT, "avatar" TEXT, "gender" "Gender", "roleId" INTEGER NOT NULL DEFAULT 3, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "users_pkey" PRIMARY KEY ("userId") );
 
    -- CreateIndex
    CREATE UNIQUE INDEX "users_email_key" ON "users"("email");