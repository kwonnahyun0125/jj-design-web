import prisma from '../config/db';
import { Prisma } from '@prisma/client';
import { GetNoticesQuery, CreateNoticeDto, UpdateNoticeDto } from '../types/notice-type';

export class NoticeRepository {
  async createNotice(data: CreateNoticeDto) {
    return prisma.notice.create({ data });
  }

  async findNoticeById(id: number) {
    return prisma.notice.findUnique({ where: { id } });
  }

  async findNoticeDetail(id: number) {
    return prisma.notice.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async findNoticeMany(query: GetNoticesQuery) {
    const {
      page = 1,
      limit = 10,
      search,
      orderBy = 'createdAt',
      order = 'desc',
      isDeleted = false,
    } = query;

    const where: Prisma.NoticeWhereInput = {
      ...(isDeleted ? {} : { isDeleted: false }),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [list, totalCount] = await prisma.$transaction([
      prisma.notice.findMany({
        where,
        orderBy: { [orderBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notice.count({ where }),
    ]);

    return { list, totalCount };
  }

  async updateNotice(id: number, data: UpdateNoticeDto) {
    return prisma.notice.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return prisma.notice.update({
      where: { id },
      data: { isDeleted: true, updatedAt: new Date() },
    });
  }
}
