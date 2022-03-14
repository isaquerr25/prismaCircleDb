/*
  Warnings:

  - A unique constraint covering the columns `[affiliatedId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "affiliatedId" INTEGER,
ADD COLUMN     "cash" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "state" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_affiliatedId_key" ON "User"("affiliatedId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_affiliatedId_fkey" FOREIGN KEY ("affiliatedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
