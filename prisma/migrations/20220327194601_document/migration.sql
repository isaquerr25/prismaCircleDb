-- CreateEnum
CREATE TYPE "DocumentRole" AS ENUM ('INVALID', 'VALID', 'PROCESS');

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "state" "DocumentRole" NOT NULL DEFAULT E'PROCESS',
    "fileName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
