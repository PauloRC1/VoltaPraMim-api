-- AlterTable
ALTER TABLE "Item" ADD COLUMN "contactPhone" TEXT,
ADD COLUMN "hidePhone" BOOLEAN NOT NULL DEFAULT false;
