-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "vintage" INTEGER NOT NULL DEFAULT 0,
    "author" TEXT NOT NULL,
    "noteText" TEXT NOT NULL,
    "rating" TEXT,
    "drinkFrom" INTEGER,
    "drinkTo" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bottleId" INTEGER NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_bottleId_fkey" FOREIGN KEY ("bottleId") REFERENCES "Bottle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
