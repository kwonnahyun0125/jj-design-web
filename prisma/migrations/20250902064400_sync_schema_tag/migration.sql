/*
  Warnings:

  - You are about to drop the `keywords` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_image_keywords` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('RESIDENCE', 'MERCANTILE', 'ARCHITECTURE');

-- CreateEnum
CREATE TYPE "public"."Lineup" AS ENUM ('FULL', 'PARTIAL');

-- CreateEnum
CREATE TYPE "public"."Keyword" AS ENUM ('APART', 'HOUSE', 'COMMERCIAL', 'NEW');

-- DropForeignKey
ALTER TABLE "public"."project_image_keywords" DROP CONSTRAINT "project_image_keywords_keywordId_fkey";

-- AlterTable
ALTER TABLE "public"."image_urls" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."keywords";

-- DropTable
DROP TABLE "public"."project_image_keywords";

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "usercode" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" VARCHAR(20),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admin_logs" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "category" "public"."Category" NOT NULL DEFAULT 'RESIDENCE',
    "description" TEXT,
    "duration" INTEGER,
    "lineup" "public"."Lineup" NOT NULL DEFAULT 'FULL',
    "keywords" "public"."Keyword"[],
    "review" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_tags" (
    "projectId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("projectId","tagId")
);

-- CreateTable
CREATE TABLE "public"."project_images" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "business" VARCHAR(100) NOT NULL,
    "naver" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company_images" (
    "companyId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "company_images_pkey" PRIMARY KEY ("imageId","companyId")
);

-- CreateTable
CREATE TABLE "public"."showrooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(20),
    "description" TEXT,
    "intro_text" TEXT,
    "map_url" TEXT,
    "imageUrl" TEXT,
    "openMinutes" INTEGER,
    "closeMinutes" INTEGER,
    "weekly_open_days" TEXT,
    "weekly_close_days" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "showrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."showroom_images" (
    "showroomId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "showroom_images_pkey" PRIMARY KEY ("showroomId","imageId")
);

-- CreateTable
CREATE TABLE "public"."furnitures" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(20),
    "description" TEXT,
    "intro_text" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "furnitures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."furniture_images" (
    "furnitureId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "furniture_images_pkey" PRIMARY KEY ("furnitureId","imageId")
);

-- CreateTable
CREATE TABLE "public"."notices" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_usercode_key" ON "public"."Admin"("usercode");

-- CreateIndex
CREATE INDEX "projects_isDeleted_idx" ON "public"."projects"("isDeleted");

-- CreateIndex
CREATE INDEX "projects_category_size_idx" ON "public"."projects"("category", "size");

-- CreateIndex
CREATE UNIQUE INDEX "project_images_imageId_projectId_key" ON "public"."project_images"("imageId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "public"."companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "showrooms_name_key" ON "public"."showrooms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "furnitures_name_key" ON "public"."furnitures"("name");

-- AddForeignKey
ALTER TABLE "public"."admin_logs" ADD CONSTRAINT "admin_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_tags" ADD CONSTRAINT "project_tags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_tags" ADD CONSTRAINT "project_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_images" ADD CONSTRAINT "project_images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_images" ADD CONSTRAINT "project_images_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."image_urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_images" ADD CONSTRAINT "project_images_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_images" ADD CONSTRAINT "company_images_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."image_urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_images" ADD CONSTRAINT "company_images_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showroom_images" ADD CONSTRAINT "showroom_images_showroomId_fkey" FOREIGN KEY ("showroomId") REFERENCES "public"."showrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showroom_images" ADD CONSTRAINT "showroom_images_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."image_urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."furniture_images" ADD CONSTRAINT "furniture_images_furnitureId_fkey" FOREIGN KEY ("furnitureId") REFERENCES "public"."furnitures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."furniture_images" ADD CONSTRAINT "furniture_images_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."image_urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
