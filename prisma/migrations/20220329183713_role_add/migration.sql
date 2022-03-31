/*
  Warnings:

  - The `state` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `action` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TransactionActionTypes" AS ENUM ('WITHDRAW', 'DEPOSIT', 'INVEST', 'COMPLETE');

-- CreateEnum
CREATE TYPE "TransactionstateTypes" AS ENUM ('CANCEL', 'PROCESS', 'COMPLETE');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "state",
ADD COLUMN     "state" "TransactionstateTypes" NOT NULL DEFAULT E'PROCESS',
DROP COLUMN "action",
ADD COLUMN     "action" "TransactionActionTypes" NOT NULL DEFAULT E'DEPOSIT';

-- DropEnum
DROP TYPE "TransactionTypes";
