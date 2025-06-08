/*
  Warnings:

  - Added the required column `language` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "template" TEXT NOT NULL;
