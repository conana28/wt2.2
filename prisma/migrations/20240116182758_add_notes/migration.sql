/*
  Warnings:

  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubRegion` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `rating` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Region" DROP CONSTRAINT "Region_countryId_fkey";

-- DropForeignKey
ALTER TABLE "SubRegion" DROP CONSTRAINT "SubRegion_regionId_fkey";

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "noteText" DROP NOT NULL,
ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "drinkFrom" SET DATA TYPE TEXT,
ALTER COLUMN "drinkTo" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Country";

-- DropTable
DROP TABLE "Region";

-- DropTable
DROP TABLE "SubRegion";
