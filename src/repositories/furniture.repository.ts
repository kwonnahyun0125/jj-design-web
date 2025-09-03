import type { Prisma } from '@prisma/client';
import prisma from '../config/db';
import type { CreateFurnitureInput, UpdateFurnitureInput } from '../types/furniture.type';

export class FurnitureRepository {
  async createFurniture(data: CreateFurnitureInput) {
    const { name, address, phoneNumber, description, introText, imageUrl } = data;

    return prisma.furniture.create({
      data: { name, address, phoneNumber, description, introText, imageUrl },
    });
  }

  async findFurnitureById(id: number) {
    return prisma.furniture.findFirst({
      where: { id, isDeleted: false },
      include: {
        furnitureImages: { include: { image: true }, orderBy: { imageId: 'asc' } },
      },
    });
  }

  /** 삭제/미삭제 전체에서 이름으로 찾기 (name @unique) */
  async findAnyByName(name: string) {
    return prisma.furniture.findUnique({ where: { name } });
  }

  /** 일반적으로 생성 전에 사용할, '미삭제 항목' 기준 이름 중복 체크 */
  async findFurnitureByName(name: string) {
    return prisma.furniture.findFirst({
      where: { name, isDeleted: false },
      select: { id: true },
    });
  }

  async updateFurniture(id: number, data: UpdateFurnitureInput) {
    return prisma.furniture.update({ where: { id }, data });
  }

  async softDeleteFurniture(id: number) {
    return prisma.furniture.update({ where: { id }, data: { isDeleted: true } });
  }

  async listFurnitures(params: {
    where: Prisma.FurnitureWhereInput;
    skip: number;
    take: number;
    orderBy: Prisma.FurnitureOrderByWithRelationInput;
  }) {
    const { where, skip, take, orderBy } = params;

    const [items, total] = await Promise.all([
      prisma.furniture.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          name: true,
          address: true,
          imageUrl: true,
        },
      }),
      prisma.furniture.count({ where }),
    ]);

    return { items, total };
  }
}
