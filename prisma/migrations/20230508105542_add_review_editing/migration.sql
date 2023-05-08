-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "shareDislikes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareLikes" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shareStats" BOOLEAN NOT NULL DEFAULT false;
