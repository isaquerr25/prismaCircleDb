/*
  Warnings:

  - The `state` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `state` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `action` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "state",
ADD COLUMN     "state" TEXT DEFAULT E'PROCESS';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "state",
ADD COLUMN     "state" TEXT DEFAULT E'PROCESS',
DROP COLUMN "action",
ADD COLUMN     "action" TEXT DEFAULT E'DEPOSIT';

-- DropEnum
DROP TYPE "DocumentRole";

-- DropEnum
DROP TYPE "TransactionActionTypes";

-- DropEnum
DROP TYPE "TransactionstateTypes";
