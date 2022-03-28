-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER', 'GUEST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'GUEST';
