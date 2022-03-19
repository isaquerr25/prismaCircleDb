-- CreateTable
CREATE TABLE "Cycle" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "valueUSD" INTEGER NOT NULL,
    "valueBTC" INTEGER NOT NULL,
    "finalValueUSD" INTEGER,
    "finalValueBTC" INTEGER,
    "state" TEXT NOT NULL,
    "beginDate" TIMESTAMP(3) NOT NULL,
    "FinishDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Cycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyProfit" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profit" INTEGER NOT NULL,

    CONSTRAINT "MonthlyProfit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cycle" ADD CONSTRAINT "Cycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
