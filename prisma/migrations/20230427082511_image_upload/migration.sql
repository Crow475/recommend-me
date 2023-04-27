/*
  Warnings:

  - Added the required column `category` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('VideoGame', 'Book', 'Movie', 'TVSeries');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
