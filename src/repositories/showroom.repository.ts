import type { Prisma } from '@prisma/client';
import prisma from '../config/db';

export class ShowroomRepository {
  static async findById(id: number) {
    return prisma.showroom.findFirst({
      where: { id, isDeleted: false },
      include: {
        showroomImages: { include: { image: true }, orderBy: { imageId: 'asc' } },
      },
    });
  }

  static async findUniqueByName(name: string) {
    return prisma.showroom.findUnique({ where: { name } });
  }

  static async create(data: Prisma.ShowroomCreateInput) {
    return prisma.showroom.create({ data });
  }

  static async update(id: number, data: Prisma.ShowroomUpdateInput) {
    return prisma.showroom.update({ where: { id }, data });
  }

  static async softDelete(id: number) {
    return prisma.showroom.update({ where: { id }, data: { isDeleted: true } });
  }

  static async list(params: {
    where: Prisma.ShowroomWhereInput;
    skip: number;
    take: number;
    orderBy: Prisma.ShowroomOrderByWithRelationInput;
  }) {
    const [items, total] = await Promise.all([
      prisma.showroom.findMany({
        where: params.where,
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy,
        select: {
          id: true,
          name: true,
          address: true,
          imageUrl: true,
          openMinutes: true,
          closeMinutes: true,
          weeklyOpenDays: true,
          weeklyCloseDays: true,
        },
      }),
      prisma.showroom.count({ where: params.where }),
    ]);
    return { items, total };
  }
}
