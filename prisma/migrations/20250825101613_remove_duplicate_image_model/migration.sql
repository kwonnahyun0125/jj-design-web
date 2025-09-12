/*
  Warnings (robust version):

  - This script conditionally renames/drops legacy CamelCase tables to snake_case.
  - It uses IF EXISTS / to_regclass checks to avoid 42P01 errors.
*/

-- [PRELUDE] 과거 CamelCase 테이블이 있으면 snake_case로 정렬
DO $$
BEGIN
  IF to_regclass('public."ProjectTag"') IS NOT NULL AND to_regclass('public.project_tags') IS NULL THEN
    ALTER TABLE "ProjectTag" RENAME TO "project_tags";
  END IF;

  -- 과거에 소문자 복수 "tags"를 썼을 수도, 현 스키마는 대문자 "Tag"일 수도 있어 방어
  IF to_regclass('public.tags') IS NOT NULL AND to_regclass('public."Tag"') IS NULL THEN
    -- 그대로 사용 (아래에서 조건부 DROP 처리)
    PERFORM 1;
  ELSIF to_regclass('public."Tag"') IS NOT NULL AND to_regclass('public.tags') IS NULL THEN
    -- 필요 시 소문자 복수로 맞춰 두고 이후 DROP
    ALTER TABLE "Tag" RENAME TO tags;
  END IF;
END
$$;

-- [FK Drop] project_images → image_urls FK (존재 시에만)
DO $$
BEGIN
  IF to_regclass('public.project_images') IS NOT NULL THEN
    ALTER TABLE "project_images" DROP CONSTRAINT IF EXISTS "project_images_imageId_fkey";
  END IF;
END
$$;

-- [projects] isdeleted → isDeleted (조건부)
DO $$
BEGIN
  IF to_regclass('public.projects') IS NOT NULL THEN
    -- 드롭 & 추가를 안전하게
    ALTER TABLE "projects"
      DROP COLUMN IF EXISTS "isdeleted",
      ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT false;
  END IF;
END
$$;

-- [DropTable] ProjectTag / project_tags (존재 시에만)
DO $$
BEGIN
  IF to_regclass('public.project_tags') IS NOT NULL THEN
    -- FK가 남아있을 수 있으니 선제적으로 FK 제거 시도(이름은 환경마다 다를 수 있어 광범위 IF EXISTS)
    ALTER TABLE "project_tags" DROP CONSTRAINT IF EXISTS "project_tags_projectId_fkey";
    ALTER TABLE "project_tags" DROP CONSTRAINT IF EXISTS "project_tags_tagId_fkey";
    DROP TABLE "project_tags";
  ELSIF to_regclass('public."ProjectTag"') IS NOT NULL THEN
    ALTER TABLE "ProjectTag" DROP CONSTRAINT IF EXISTS "ProjectTag_projectId_fkey";
    ALTER TABLE "ProjectTag" DROP CONSTRAINT IF EXISTS "ProjectTag_tagId_fkey";
    DROP TABLE "ProjectTag";
  END IF;
END
$$;

-- [DropTable] tags / "Tag" (존재 시에만)
DO $$
BEGIN
  IF to_regclass('public.tags') IS NOT NULL THEN
    DROP TABLE "tags";
  ELSIF to_regclass('public."Tag"') IS NOT NULL THEN
    DROP TABLE "Tag";
  END IF;
END
$$;

-- [CreateTable] project_image_keywords (없을 때만)
DO $$
BEGIN
  IF to_regclass('public.project_image_keywords') IS NULL THEN
    CREATE TABLE "project_image_keywords" (
      "projectId" INTEGER NOT NULL,
      "imageId"   INTEGER NOT NULL,
      "keywordId" INTEGER NOT NULL,
      CONSTRAINT "project_image_keywords_pkey" PRIMARY KEY ("projectId","imageId","keywordId")
    );
  END IF;
END
$$;

-- [CreateTable] keywords (없을 때만)
DO $$
BEGIN
  IF to_regclass('public.keywords') IS NULL THEN
    CREATE TABLE "keywords" (
      "id"        SERIAL PRIMARY KEY,
      "name"      TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "keywords_name_key" ON "keywords"("name");
    CREATE INDEX IF NOT EXISTS "keywords_name_idx" ON "keywords"("name");
  END IF;
END
$$;

-- [Indexes] projects: 현재 컬럼명에 맞춰 생성 (size, category)
DO $$
BEGIN
  IF to_regclass('public.projects') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS "projects_isDeleted_idx" ON "projects"("isDeleted");
    -- areaSize → size (스키마 컬럼명 교정)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='projects' AND column_name='size'
    ) THEN
      CREATE INDEX IF NOT EXISTS "projects_size_idx" ON "projects"("size");
    END IF;
    -- type → category (스키마 컬럼명 교정)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='projects' AND column_name='category'
    ) THEN
      CREATE INDEX IF NOT EXISTS "projects_category_idx" ON "projects"("category");
    END IF;
  END IF;
END
$$;

-- [FK Re-Add] project_images.imageId → image_urls.id (존재 시에만)
DO $$
BEGIN
  IF to_regclass('public.project_images') IS NOT NULL
     AND to_regclass('public.image_urls') IS NOT NULL THEN
    -- 기존에 있으면 먼저 제거 (이름 충돌 방지)
    ALTER TABLE "project_images" DROP CONSTRAINT IF EXISTS "project_images_imageId_fkey";
    ALTER TABLE "project_images"
      ADD CONSTRAINT "project_images_imageId_fkey"
      FOREIGN KEY ("imageId") REFERENCES "image_urls"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;

-- [FK Add] project_image_keywords → project_images(imageId, projectId), keywords(id)
DO $$
BEGIN
  IF to_regclass('public.project_image_keywords') IS NOT NULL THEN
    IF to_regclass('public.project_images') IS NOT NULL THEN
      ALTER TABLE "project_image_keywords"
        DROP CONSTRAINT IF EXISTS "project_image_keywords_imageId_projectId_fkey";
      ALTER TABLE "project_image_keywords"
        ADD CONSTRAINT "project_image_keywords_imageId_projectId_fkey"
        FOREIGN KEY ("imageId","projectId") REFERENCES "project_images"("imageId","projectId")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF to_regclass('public.keywords') IS NOT NULL THEN
      ALTER TABLE "project_image_keywords"
        DROP CONSTRAINT IF EXISTS "project_image_keywords_keywordId_fkey";
      ALTER TABLE "project_image_keywords"
        ADD CONSTRAINT "project_image_keywords_keywordId_fkey"
        FOREIGN KEY ("keywordId") REFERENCES "keywords"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
  END IF;
END
$$;
