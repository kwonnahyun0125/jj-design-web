/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `notices` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Size" AS ENUM ('SIZE20', 'SIZE30', 'SIZE40', 'SIZE50', 'SIZE60', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Keyword" ADD VALUE 'OFFICE';
ALTER TYPE "public"."Keyword" ADD VALUE 'REMODELING';

-- AlterTable
ALTER TABLE "public"."notices" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "sizeTag" "public"."Size" NOT NULL DEFAULT 'OTHER';
