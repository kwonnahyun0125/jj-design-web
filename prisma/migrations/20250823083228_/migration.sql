-- 20250823083228_ (robust, idempotent)

-- [PRELUDE] image_urls 존재 보장: 과거명이 "images"면 리네임, 둘 다 없으면 최소 스키마 생성
DO $$
BEGIN
  IF to_regclass('public.image_urls') IS NULL
     AND to_regclass('public.images') IS NOT NULL THEN
    ALTER TABLE "images" RENAME TO "image_urls";
  END IF;

  IF to_regclass('public.image_urls') IS NULL
     AND to_regclass('public.images') IS NULL THEN
    CREATE TABLE IF NOT EXISTS "image_urls" (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "isDeleted" BOOLEAN NOT NULL DEFAULT false
    );
  END IF;
END
$$;

-- 1) image_urls FK들 제거 (테이블 존재 시에만)
DO $$
BEGIN
  IF to_regclass('public.image_urls') IS NOT NULL THEN
    ALTER TABLE "image_urls" DROP CONSTRAINT IF EXISTS "image_urls_companyId_fkey";
    ALTER TABLE "image_urls" DROP CONSTRAINT IF EXISTS "image_urls_furnitureId_fkey";
    ALTER TABLE "image_urls" DROP CONSTRAINT IF EXISTS "image_urls_projectId_fkey";
    ALTER TABLE "image_urls" DROP CONSTRAINT IF EXISTS "image_urls_showroomId_fkey";
  END IF;
END
$$;

-- 2) url 유니크 제거
-- Prisma의 @unique는 보통 CONSTRAINT 이름이 "image_urls_url_key"로 생깁니다.
-- 혹시 인덱스로 생성된 환경도 대비해 둘 다 시도(조건부)합니다.
DO $$
BEGIN
  IF to_regclass('public.image_urls') IS NOT NULL THEN
    -- 인덱스로 존재했을 가능성
    DROP INDEX IF EXISTS "image_urls_url_key";
    -- 제약조건으로 존재했을 가능성(일반적 케이스)
    ALTER TABLE "image_urls" DROP CONSTRAINT IF EXISTS "image_urls_url_key";
  END IF;
END
$$;

-- 3) isdeleted → isDeleted 교정 유틸 (각 테이블/컬럼 존재 시에만)
DO $$
BEGIN
  -- Admin (주의: 대문자 테이블명이라 항상 쿼트 필요)
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='Admin'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Admin' AND column_name='isdeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "Admin" RENAME COLUMN "isdeleted" TO "isDeleted"';
    ELSIF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Admin' AND column_name='isDeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "Admin" ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false';
    END IF;
  END IF;

  -- companies
  IF to_regclass('public.companies') IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='companies' AND column_name='isdeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "companies" RENAME COLUMN "isdeleted" TO "isDeleted"';
    ELSIF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='companies' AND column_name='isDeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "companies" ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false';
    END IF;
  END IF;

  -- furnitures
  IF to_regclass('public.furnitures') IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='furnitures' AND column_name='isdeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "furnitures" RENAME COLUMN "isdeleted" TO "isDeleted"';
    ELSIF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='furnitures' AND column_name='isDeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "furnitures" ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false';
    END IF;
  END IF;

  -- notices
  IF to_regclass('public.notices') IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='notices' AND column_name='isdeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "notices" RENAME COLUMN "isdeleted" TO "isDeleted"';
    ELSIF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='notices' AND column_name='isDeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "notices" ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false';
    END IF;
  END IF;

  -- showrooms
  IF to_regclass('public.showrooms') IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='showrooms' AND column_name='isdeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "showrooms" RENAME COLUMN "isdeleted" TO "isDeleted"';
    ELSIF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='showrooms' AND column_name='isDeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "showrooms" ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false';
    END IF;
  END IF;
END
$$;

-- 4) image_urls 컬럼 정리 + isDeleted 보장 (테이블 존재 시에만)
DO $$
BEGIN
  IF to_regclass('public.image_urls') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE "image_urls"
               DROP COLUMN IF EXISTS "companyId",
               DROP COLUMN IF EXISTS "furnitureId",
               DROP COLUMN IF EXISTS "projectId",
               DROP COLUMN IF EXISTS "showroomId"';
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='image_urls' AND column_name='isdeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "image_urls" RENAME COLUMN "isdeleted" TO "isDeleted"';
    ELSIF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='image_urls' AND column_name='isDeleted'
    ) THEN
      EXECUTE 'ALTER TABLE "image_urls" ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false';
    END IF;
  END IF;
END
$$;

-- 5) 프로젝트 컬럼 필수화: 현재 스키마는 'type' 대신 'category' 사용
DO $$
BEGIN
  IF to_regclass('public.projects') IS NOT NULL THEN
    -- 만약 과거 DB에 "type" 컬럼이 있으면 그걸 NOT NULL로(원래 마이그 의도)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='projects' AND column_name='type'
    ) THEN
      EXECUTE 'ALTER TABLE "projects" ALTER COLUMN "type" SET NOT NULL';
    ELSE
      -- 현재 스키마: category를 필수로
      EXECUTE 'UPDATE "projects" SET "category" = ''RESIDENCE'' WHERE "category" IS NULL';
      EXECUTE 'ALTER TABLE "projects" ALTER COLUMN "category" SET NOT NULL';
    END IF;
  END IF;
END
$$;
