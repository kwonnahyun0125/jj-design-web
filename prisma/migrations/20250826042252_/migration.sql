/*
  Robust & Idempotent rewrite
  - Safely drop legacy indexes if they exist
  - Rebuild project_images PK using an integer id (fills existing rows)
  - Add UNIQUE CONSTRAINT on (imageId, projectId) for FK reference
  - Fix projects indexes to match (category, size)
*/

-- 0) 오래된 인덱스들 제거(있을 때만) - 이름 케이스/따옴표 양쪽 커버
DO $$
BEGIN
  DROP INDEX IF EXISTS "projects_areaSize_idx";
  DROP INDEX IF EXISTS projects_areaSize_idx;

  DROP INDEX IF EXISTS "projects_type_idx";
  DROP INDEX IF EXISTS projects_type_idx;
END
$$;

-- 1) 자식 FK 먼저 제거 (있을 때만)
DO $$
BEGIN
  IF to_regclass('public.project_image_keywords') IS NOT NULL THEN
    ALTER TABLE "project_image_keywords"
      DROP CONSTRAINT IF EXISTS "project_image_keywords_imageId_projectId_fkey";
  END IF;
END
$$;

-- 2) 부모 테이블(project_images) PK 재구성
DO $$
BEGIN
  IF to_regclass('public.project_images') IS NOT NULL THEN
    -- (a) id 컬럼 없으면 추가 (기존 로우 채우기 포함)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='project_images' AND column_name='id'
    ) THEN
      -- 빈 컬럼 추가
      ALTER TABLE "project_images" ADD COLUMN "id" INTEGER;

      -- 시퀀스 준비 및 기본값 설정
      CREATE SEQUENCE IF NOT EXISTS project_images_id_seq OWNED BY "project_images"."id";
      ALTER TABLE "project_images" ALTER COLUMN "id" SET DEFAULT nextval('project_images_id_seq');

      -- 기존 로우에 id 채우기
      UPDATE "project_images" SET "id" = nextval('project_images_id_seq') WHERE "id" IS NULL;

      -- NOT NULL 강제
      ALTER TABLE "project_images" ALTER COLUMN "id" SET NOT NULL;
    END IF;

    -- (b) 기존 PK가 (imageId, projectId)라면 먼저 제거
    ALTER TABLE "project_images" DROP CONSTRAINT IF EXISTS "project_images_pkey";

    -- (c) 새 PK를 id로 설정 (이미 설정돼 있으면 재설정 시도해도 무해)
    ALTER TABLE "project_images" ADD CONSTRAINT "project_images_pkey" PRIMARY KEY ("id");

    -- (d) (imageId, projectId)에 대한 UNIQUE 제약조건 보장 (FK 대상은 'unique constraint'가 안전)
    ALTER TABLE "project_images"
      ADD CONSTRAINT "project_images_imageId_projectId_key" UNIQUE ("imageId","projectId");
  END IF;
END
$$;

-- 3) 자식 FK 재추가: (imageId, projectId) → project_images(imageId, projectId) UNIQUE 제약조건으로 참조
DO $$
BEGIN
  IF to_regclass('public.project_image_keywords') IS NOT NULL
     AND to_regclass('public.project_images') IS NOT NULL THEN
    -- 혹시나 남아있으면 안전 제거 후 재생성
    ALTER TABLE "project_image_keywords"
      DROP CONSTRAINT IF EXISTS "project_image_keywords_imageId_projectId_fkey";

    ALTER TABLE "project_image_keywords"
      ADD CONSTRAINT "project_image_keywords_imageId_projectId_fkey"
      FOREIGN KEY ("imageId","projectId")
      REFERENCES "project_images" ("imageId","projectId")
      ON UPDATE CASCADE
      ON DELETE CASCADE;
  END IF;
END
$$;

-- 4) projects 인덱스: 실제 컬럼(category, size)에 맞춰 생성 (있으면 유지)
DO $$
BEGIN
  IF to_regclass('public.projects') IS NOT NULL THEN
    -- 개별 인덱스
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='projects' AND column_name='category'
    ) THEN
      CREATE INDEX IF NOT EXISTS projects_category_idx ON "projects"("category");
    END IF;
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='projects' AND column_name='size'
    ) THEN
      CREATE INDEX IF NOT EXISTS projects_size_idx ON "projects"("size");
    END IF;

    -- 복합 인덱스 (category, size) - 선택사항이지만 쿼리에 유용
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='projects' AND column_name='category'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='projects' AND column_name='size'
    ) THEN
      CREATE INDEX IF NOT EXISTS projects_category_size_idx ON "projects"("category","size");
    END IF;
  END IF;
END
$$;
