/*
  Warnings:

  - The `action` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TransactionTypes" AS ENUM ('WITHDRAW', 'DEPOSIT', 'INVEST', 'COMPLETE', 'CANCEL');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "action",
ADD COLUMN     "action" "TransactionTypes" NOT NULL DEFAULT E'DEPOSIT';
