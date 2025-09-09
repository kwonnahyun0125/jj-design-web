import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password-util';

const prisma = new PrismaClient();

async function main() {
  // 태그 목록
  const tags = [
    // RESIDENCE, 100번대
    { id: 101, name: '현관' },
    { id: 102, name: '거실' },
    { id: 103, name: '욕실' },
    { id: 104, name: '주방' },
    { id: 105, name: '방' },
    { id: 106, name: '베란다' },

    // MERCANTILE, 200번대
    { id: 201, name: '사무공간' },
    { id: 202, name: '휴게공간' },
    { id: 203, name: '주방' },
    { id: 204, name: '홀' },
    { id: 205, name: '가구' },

    // ARCHITECTURE, 300번대
    { id: 301, name: '외부' },
    { id: 302, name: '내부' },
    { id: 303, name: '조감도' },
  ];

  // 태그 삽입 (upsert 사용 → 중복 실행해도 안전)
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { id: tag.id },
      update: { name: tag.name },
      create: {
        id: tag.id,
        name: tag.name,
      },
    });
  }

  console.log('Tag seeding completed');

  const hashedPassword = await hashPassword('password');

  await prisma.admin.upsert({
    where: { usercode: 'admin' },
    update: {},
    create: {
      usercode: 'admin',
      password: hashedPassword,
      name: 'Admin',
      phoneNumber: '010-1234-5678',
    },
  });

  console.log('Admin seeding completed');

  await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'JJ 디자인',
      address: '서울특별시 강남구 테헤란로 123',
      phone: '123-456-7890',
      owner: '홍길동',
      email: 'owner@jjdesign.com',
      business: '123-45-67890',
      naver: 'naver.com/owner',
      instagram: 'instagram.com/owner',
    },
  });

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
