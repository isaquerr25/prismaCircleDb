/*
  Warnings:

  - You are about to drop the column `FinishDate` on the `Cycle` table. All the data in the column will be lost.
  - Added the required column `finishDate` to the `Cycle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cycle" DROP COLUMN "FinishDate",
ADD COLUMN     "finishDate" TIMESTAMP(3) NOT NULL;
