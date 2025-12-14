/*
  Warnings:

  - You are about to drop the column `comepletedAt` on the `executionPhase` table. All the data in the column will be lost.
  - You are about to drop the column `creditsCost` on the `executionPhase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "executionPhase" DROP COLUMN "comepletedAt",
DROP COLUMN "creditsCost",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "creditsConsumed" INTEGER;
