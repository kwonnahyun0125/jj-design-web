import type { Prisma } from '@prisma/client';
import prisma from '../config/db';
import type { CreateShowroomInput, UpdateShowroomInput } from '../types/showroom.type';

export class ShowroomRepository {
  async findAnyByName(name: string) {
    return prisma.showroom.findFirst({ where: { name } });
  }
  async createShowroom(data: CreateShowroomInput) {
    const {
      name,
      address,
      phoneNumber,
      description,
      introText,
      mapUrl,
      imageUrl,
      openMinutes,
      closeMinutes,
      weeklyOpenDays,
      weeklyCloseDays,
    } = data;
    return prisma.showroom.create({
      data: {
        name,
        address,
        phoneNumber,
        description,
        introText,
        mapUrl,
        imageUrl,
        openMinutes,
        closeMinutes,
        weeklyOpenDays,
        weeklyCloseDays,
      },
    });
  }
  async findShowroomById(id: number) {
    return prisma.showroom.findFirst({
      where: { id, isDeleted: false },
      include: { showroomImages: { include: { image: true }, orderBy: { imageId: 'asc' } } },
    });
  }
  async findShowroomByName(name: string) {
    return prisma.showroom.findUnique({ where: { name } });
  }
  async updateShowroom(id: number, data: UpdateShowroomInput) {
    return prisma.showroom.update({ where: { id }, data });
  }
  async softDeleteShowroom(id: number) {
    return prisma.showroom.update({ where: { id }, data: { isDeleted: true } });
  }

  async listShowrooms(params: {
    where: Prisma.ShowroomWhereInput;
    skip: number;
    take: number;
    orderBy: Prisma.ShowroomOrderByWithRelationInput;
  }) {
    const { where, skip, take, orderBy } = params;
    const [items, total] = await Promise.all([
      prisma.showroom.findMany({
        where,
        skip,
        take,
        orderBy,
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
      prisma.showroom.count({ where }),
    ]);
    return { items, total };
  }
}
