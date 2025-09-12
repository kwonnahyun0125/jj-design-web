/*
  Warnings:

  - You are about to drop the column `isdeleted` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `isdeleted` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `isdeleted` on the `furnitures` table. All the data in the column will be lost.
  - You are about to drop the column `isdeleted` on the `image_urls` table. All the data in the column will be lost.
  - You are about to drop the column `isdeleted` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `isdeleted` on the `showrooms` table. All the data in the column will be lost.
  - Made the column `type` on table `projects` required. (NOTE: current schema uses `category`; handled below.)
*/

-- 1) image_urls / images 제약조건 드롭을 조건부로 안전 처리
DO $$
BEGIN
  IF to_regclass('public.image_urls') IS NOT NULL THEN
    ALTER TABLE "image_urls" DROP CONSTRAINT IF EXISTS "image_urls_url_key";
  END IF;

  IF to_regclass('public.images') IS NOT NULL THEN
    ALTER TABLE "images" DROP CONSTRAINT IF EXISTS "images_url_key";
    ALTER TABLE "images" DROP CONSTRAINT IF EXISTS "image_urls_url_key";
  END IF;
END
$$;

-- 2) 컬럼 리네임(isdeleted -> isDeleted) 작업 (모든 ALTER TABLE 에 IF EXISTS 추가)

-- Admin (주의: 대문자 테이블명이라 쿼트 필요)
ALTER TABLE IF EXISTS "Admin"
  DROP COLUMN IF EXISTS "isdeleted",
  ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- companies
ALTER TABLE IF EXISTS "companies"
  DROP COLUMN IF EXISTS "isdeleted",
  ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- furnitures
ALTER TABLE IF EXISTS "furnitures"
  DROP COLUMN IF EXISTS "isdeleted",
  ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- image_urls (테이블 자체가 없을 수 있어 DO 블록으로 처리)
DO $$
BEGIN
  IF to_regclass('public.image_urls') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE "image_urls"
               DROP COLUMN IF EXISTS "isdeleted",
               ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false';
  END IF;
END
$$;

-- notices
ALTER TABLE IF EXISTS "notices"
  DROP COLUMN IF EXISTS "isdeleted",
  ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- showrooms
ALTER TABLE IF EXISTS "showrooms"
  DROP COLUMN IF EXISTS "isdeleted",
  ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- 3) projects.category 를 NOT NULL 로 (테이블 존재 시에만)
DO $$
BEGIN
  IF to_regclass('public.projects') IS NOT NULL THEN
    UPDATE "projects" SET "category" = 'RESIDENCE' WHERE "category" IS NULL;
    ALTER TABLE "projects" ALTER COLUMN "category" SET NOT NULL;
  END IF;
END
$$;
