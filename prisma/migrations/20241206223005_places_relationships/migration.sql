/*
  Warnings:

  - You are about to drop the column `districtId` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `Sector` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_districtId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_provinceId_fkey";

-- DropForeignKey
ALTER TABLE "Sector" DROP CONSTRAINT "Sector_provinceId_fkey";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "districtId",
DROP COLUMN "provinceId";

-- AlterTable
ALTER TABLE "Sector" DROP COLUMN "provinceId";
