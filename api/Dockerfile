# ===== builder =====
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

# 빌드 전에 Prisma Client 생성 (개발 단계)
RUN npx prisma generate
RUN npm run build


# ===== runner =====
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV HUSKY=0

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm install --only=production

# 빌드 산출물 + Prisma 스키마 복사
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# ✅ 런타임 컨테이너에서도 Prisma Client 생성 (핵심 수정)
#    멀티스테이지의 runner에는 prisma CLI가 없으니 npx로 버전 지정 실행
RUN npx -y prisma@6.14.0 generate --schema=prisma/schema.prisma

# 엔트리포인트
COPY --from=builder /usr/src/app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["./entrypoint.sh"]
