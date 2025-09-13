#!/usr/bin/env sh
set -e

echo "[entrypoint] node: $(node -v)"
echo "[entrypoint] npm : $(npm -v)"

# 1) 런타임에서 Prisma Client 반드시 생성
echo "[entrypoint] prisma generate..."
npx -y prisma@6.14.0 generate --schema=prisma/schema.prisma

# 2) 마이그레이션 (실패해도 서버는 일단 띄움)
if [ "$SKIP_MIGRATIONS" != "1" ]; then
  echo "[entrypoint] prisma migrate deploy..."
  if ! npx -y prisma@6.14.0 migrate deploy; then
    echo "[entrypoint][WARN] migrate deploy failed. Continue to start server."
  fi
else
  echo "[entrypoint] SKIP_MIGRATIONS=1 -> skip migrate"
fi

# 3) 서버 기동
echo "[entrypoint] start server..."
exec node dist/src/app.js