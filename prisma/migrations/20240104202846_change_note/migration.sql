/*
  Warnings:

  - You are about to drop the column `bottleId` on the `Note` table. All the data in the column will be lost.
  - Added the required column `wineId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_bottleId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "bottleId",
ADD COLUMN     "wineId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_wineId_fkey" FOREIGN KEY ("wineId") REFERENCES "Wine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
