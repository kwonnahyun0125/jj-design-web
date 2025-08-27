import prisma from '../config/db';
import { Prisma } from '@prisma/client';
import { CreateProjectDto, GetProjectsQuery } from '../types/project-type';
import { NotFoundError } from '../types/error-type';

export class ProjectRepository {
  async createProject(data: CreateProjectDto) {
    const { title, areaSize, type, description, durationWeeks, reviews, imageUrl } = data;

    return prisma.project.create({
      data: { title, areaSize, type, description, durationWeeks, reviews, imageUrl },
    });
  }

  async findProjects(query: GetProjectsQuery) {
    const and: Prisma.ProjectWhereInput[] = [{ isDeleted: false }];

    if (query.q) {
      and.push({
        OR: [
          { title: { contains: query.q, mode: 'insensitive' } },
          { description: { contains: query.q, mode: 'insensitive' } },
        ],
      });
    }

    if (query.type) {
      and.push({ type: query.type });
    }

    if (query.keywordIds && query.keywordIds.length > 0) {
      and.push({
        projectImages: {
          some: {
            AND: query.keywordIds.map((kid) => ({
              imageKeywords: { some: { keywordId: kid } },
            })),
            image: { isDeleted: false },
          },
        },
      });
    }

    const where: Prisma.ProjectWhereInput = { AND: and };
    const page = Math.max(1, query.page);
    const pageSize = Math.min(100, Math.max(1, query.pageSize));
    const skip = (page - 1) * pageSize;

    const [total, rows] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ]);

    return { page, pageSize, total, rows };
  }

  // 상세 조회: 프로젝트 + 이미지(+키워드)
  async findProjectDetail(id: number) {
    return prisma.project.findFirst({
      where: { id, isDeleted: false },
      include: {
        projectImages: {
          where: { image: { isDeleted: false } },
          include: {
            image: true,
            imageKeywords: { include: { keyword: true } },
          },
        },
      },
    });
  }

  async findProjectById(id: number) {
    return prisma.project.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async softDeleteProject(id: number) {
    const exists = await prisma.project.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundError('PROJECT_NOT_FOUND'); // ← 커스텀 에러
    }

    await prisma.project.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { id, deleted: true };
  }

  async updateProject(id: number, data: Prisma.ProjectUpdateInput) {
    const exists = await prisma.project.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundError('PROJECT_NOT_FOUND'); // ← 커스텀 에러
    }

    return prisma.project.update({
      where: { id },
      data,
    });
  }
}

export default new ProjectRepository();
