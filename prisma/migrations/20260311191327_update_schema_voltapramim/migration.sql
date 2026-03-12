/*
  Warnings:

  - You are about to drop the column `ra_or_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ra]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `ra` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('PERDIDO', 'ENCONTRADO', 'DEVOLVIDO');

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_userId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "status",
ADD COLUMN     "status" "ItemStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ra_or_id",
DROP COLUMN "whatsapp",
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "ra" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "Status";

-- CreateIndex
CREATE UNIQUE INDEX "User_ra_key" ON "User"("ra");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
