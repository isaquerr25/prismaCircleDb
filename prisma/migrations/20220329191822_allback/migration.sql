/*
  Warnings:

  - The `state` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DocumentRole" AS ENUM ('INVALID', 'VALID', 'PROCESS');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "state",
ADD COLUMN     "state" "DocumentRole" DEFAULT E'PROCESS';
