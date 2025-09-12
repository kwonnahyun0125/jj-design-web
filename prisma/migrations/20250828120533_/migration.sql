/*
  Robust & Idempotent migration for Admin:
  - Safely remove legacy email unique (index/constraint, quoted/unquoted)
  - Add usercode/password in a nullable step, backfill, then set NOT NULL
  - Backfill password from passwordHash, usercode from email/name/id
  - Drop legacy columns (email, passwordHash, role)
  - Guarantee UNIQUE(usercode)
*/

DO $$
BEGIN
  -- 0) Admin 테이블이 있을 때만 처리 (대문자 테이블명은 항상 쿼트)
  IF to_regclass('public."Admin"') IS NULL THEN
    RETURN;
  END IF;

  -- 1) 과거 email 유니크 제거 (인덱스/제약조건, 따옴표 유무 모두 방어)
  DROP INDEX IF EXISTS "Admin_email_key";
  DROP INDEX IF EXISTS Admin_email_key;
  ALTER TABLE "Admin" DROP CONSTRAINT IF EXISTS "Admin_email_key";
  ALTER TABLE "Admin" DROP CONSTRAINT IF EXISTS Admin_email_key;

  -- 2) 새 컬럼 먼저 "널 허용"으로 추가 (있으면 건너뜀)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='Admin' AND column_name='usercode'
  ) THEN
    ALTER TABLE "Admin" ADD COLUMN "usercode" TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='Admin' AND column_name='password'
  ) THEN
    ALTER TABLE "Admin" ADD COLUMN "password" TEXT;
  END IF;

  -- 3) 백필
  -- 3-1) password: passwordHash가 있으면 그대로 복사
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='Admin' AND column_name='passwordHash'
  ) THEN
    UPDATE "Admin"
    SET "password" = COALESCE("password", "passwordHash")
    WHERE "password" IS NULL;
  END IF;

  -- 3-2) usercode: email 있으면 email로, 없으면 name+'_'+id로 보정 (충돌 최소화)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='Admin' AND column_name='email'
  ) THEN
    UPDATE "Admin"
    SET "usercode" = COALESCE("usercode", NULLIF(TRIM("email"), ''))
    WHERE "usercode" IS NULL;
  END IF;

  -- email이 없거나 비어 있는 경우 name+"_"+id 로 백필
  UPDATE "Admin"
  SET "usercode" = COALESCE(
    "usercode",
    CASE
      WHEN COALESCE(NULLIF(TRIM("name"), ''), '') <> '' THEN TRIM("name") || '_' || "id"
      ELSE 'admin_' || "id"
    END
  )
  WHERE "usercode" IS NULL;

  -- 3-3) password가 여전히 NULL이면 임시 값 보정(최소 NOT NULL 보장; 운영에서 꼭 재설정 권장)
  UPDATE "Admin"
  SET "password" = COALESCE("password", 'TEMP_PASSWORD_' || "id")
  WHERE "password" IS NULL;

  -- 4) NOT NULL 강제
  ALTER TABLE "Admin" ALTER COLUMN "usercode" SET NOT NULL;
  ALTER TABLE "Admin" ALTER COLUMN "password" SET NOT NULL;

  -- 5) UNIQUE(usercode) 보장 (이미 있으면 패스)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public."Admin"'::regclass
      AND conname  = 'Admin_usercode_key'
  ) THEN
    ALTER TABLE "Admin"
      ADD CONSTRAINT "Admin_usercode_key" UNIQUE ("usercode");
  END IF;

  -- 6) 레거시 컬럼 제거 (있을 때만)
  ALTER TABLE "Admin" DROP COLUMN IF EXISTS "email";
  ALTER TABLE "Admin" DROP COLUMN IF EXISTS "passwordHash";
  ALTER TABLE "Admin" DROP COLUMN IF EXISTS "role";
END
$$;
