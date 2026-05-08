-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "InstitutionalAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ra" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionalAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionalAccount_email_key" ON "InstitutionalAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionalAccount_ra_key" ON "InstitutionalAccount"("ra");

-- Seed baseline institutional accounts
INSERT INTO "InstitutionalAccount" ("id", "name", "email", "ra", "phone", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'Marcinho Branco', 'marcinho.nbrc@universidade.edu', '24011434', '(11) 99876-5432', CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Beatriz Araujo', 'beatriz.araujo@universidade.edu', '24011888', '(11) 99112-3344', CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Lucas Ferreira', 'lucas.ferreira@universidade.edu', '24012001', '(11) 98765-1030', CURRENT_TIMESTAMP)
ON CONFLICT ("ra") DO NOTHING;

-- Promote current project owner account, if it already exists
UPDATE "User" SET "role" = 'ADMIN' WHERE "ra" = '24011434';
