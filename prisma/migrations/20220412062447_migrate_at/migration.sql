-- CreateTable
CREATE TABLE "EmailBack" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailBack_pkey" PRIMARY KEY ("id")
);
