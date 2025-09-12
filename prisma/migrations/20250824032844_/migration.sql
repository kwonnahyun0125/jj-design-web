/*
  Warnings:

  - You are about to drop the column `companyId` on the `image_urls` table. All the data in the column will be lost.
  - You are about to drop the column `furnitureId` on the `image_urls` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `image_urls` table. All the data in the column will be lost.
  - You are about to drop the column `showroomId` on the `image_urls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "image_urls" DROP COLUMN "companyId",
DROP COLUMN "furnitureId",
DROP COLUMN "projectId",
DROP COLUMN "showroomId";
