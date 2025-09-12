-- 20250831135922_ (robust, idempotent)

-- 0) ENUM 존재 보장 (pg_type 체크로 안전 생성)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'ConsultingType' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE "public"."ConsultingType" AS ENUM ('RESIDENCE','MERCANTILE','ARCHITECTURE');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'ConsultingStatus' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE "public"."ConsultingStatus" AS ENUM ('UNCHECKED','CHECKED','CONTACTED');
  END IF;
END
$$;

-- 1) 과거 테이블명이 "ConsultingRequest" 였다면 우선 "Consulting"으로 정렬
DO $$
BEGIN
  IF to_regclass('public."Consulting"') IS NULL
     AND to_regclass('public."ConsultingRequest"') IS NOT NULL THEN
    ALTER TABLE "ConsultingRequest" RENAME TO "Consulting";
  END IF;
END
$$;

-- 2) "Consulting" 테이블 생성/보강 (있으면 보강, 없으면 생성)
DO $$
BEGIN
  IF to_regclass('public."Consulting"') IS NULL THEN
    -- 없으면 새로 생성
    CREATE TABLE "public"."Consulting" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(100) NOT NULL,
      "phone" VARCHAR(20) NOT NULL,
      "address" VARCHAR(255) NOT NULL,
      "type" "public"."ConsultingType" NOT NULL DEFAULT 'RESIDENCE',
      "size" VARCHAR(50) NOT NULL,
      "budget" VARCHAR(50) NOT NULL,
      "preferredDate" TIMESTAMP(3) NOT NULL,
      "note" TEXT,
      "isAgreeTerms" BOOLEAN NOT NULL DEFAULT false,
      "status" "public"."ConsultingStatus" NOT NULL DEFAULT 'UNCHECKED',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  ELSE
    -- 있으면 스키마 보강(컬럼 없으면 추가 → 기본값 채우고 → NOT NULL)
    -- name
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='name'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "name" VARCHAR(100);
      UPDATE "Consulting" SET "name" = COALESCE("name",'') WHERE "name" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "name" SET NOT NULL;
    END IF;

    -- phone
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='phone'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "phone" VARCHAR(20);
      UPDATE "Consulting" SET "phone" = COALESCE("phone",'') WHERE "phone" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "phone" SET NOT NULL;
    END IF;

    -- address
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='address'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "address" VARCHAR(255);
      UPDATE "Consulting" SET "address" = COALESCE("address",'') WHERE "address" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "address" SET NOT NULL;
    END IF;

    -- type (ENUM)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='type'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "type" "public"."ConsultingType";
      UPDATE "Consulting" SET "type" = COALESCE("type",'RESIDENCE'::"public"."ConsultingType") WHERE "type" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "type" SET DEFAULT 'RESIDENCE';
      ALTER TABLE "Consulting" ALTER COLUMN "type" SET NOT NULL;
    END IF;

    -- size
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='size'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "size" VARCHAR(50);
      UPDATE "Consulting" SET "size" = COALESCE("size",'') WHERE "size" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "size" SET NOT NULL;
    END IF;

    -- budget
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='budget'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "budget" VARCHAR(50);
      UPDATE "Consulting" SET "budget" = COALESCE("budget",'') WHERE "budget" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "budget" SET NOT NULL;
    END IF;

    -- preferredDate
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='preferredDate'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "preferredDate" TIMESTAMP(3);
      UPDATE "Consulting" SET "preferredDate" = COALESCE("preferredDate", CURRENT_TIMESTAMP) WHERE "preferredDate" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "preferredDate" SET NOT NULL;
    END IF;

    -- note
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='note'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "note" TEXT;
    END IF;

    -- isAgreeTerms
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='isAgreeTerms'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "isAgreeTerms" BOOLEAN;
      UPDATE "Consulting" SET "isAgreeTerms" = COALESCE("isAgreeTerms", false) WHERE "isAgreeTerms" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "isAgreeTerms" SET DEFAULT false;
      ALTER TABLE "Consulting" ALTER COLUMN "isAgreeTerms" SET NOT NULL;
    END IF;

    -- status (ENUM)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='status'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "status" "public"."ConsultingStatus";
      UPDATE "Consulting" SET "status" = COALESCE("status",'UNCHECKED'::"public"."ConsultingStatus") WHERE "status" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "status" SET DEFAULT 'UNCHECKED';
      ALTER TABLE "Consulting" ALTER COLUMN "status" SET NOT NULL;
    END IF;

    -- createdAt
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='Consulting' AND column_name='createdAt'
    ) THEN
      ALTER TABLE "Consulting" ADD COLUMN "createdAt" TIMESTAMP(3);
      UPDATE "Consulting" SET "createdAt" = COALESCE("createdAt", CURRENT_TIMESTAMP) WHERE "createdAt" IS NULL;
      ALTER TABLE "Consulting" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE "Consulting" ALTER COLUMN "createdAt" SET NOT NULL;
    END IF;
  END IF;
END
$$;

-- 3) 남아 있는 옛 테이블 "ConsultingRequest" 는 조용히 정리
DROP TABLE IF EXISTS "public"."ConsultingRequest";
