import prisma from '../config/db';
import { Prisma, ProjectType } from '@prisma/client';
import { CreateProjectDto, GetProjectsQuery } from '../types/project-type';

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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [
          { title: { contains: query.q, mode: 'insensitive' } },
          { description: { contains: query.q, mode: 'insensitive' } },
        ],
      });
    }

    if (query.type) {
      and.push({ type: query.type as unknown as ProjectType });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
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
          // 이미지 삭제된 건 제외
          where: {
            image: { isDeleted: false },
          },
          include: {
            image: true,
            imageKeywords: {
              include: {
                keyword: true,
              },
            },
          },
        },
      },
    });
  }

  // (기존 단순 조회가 다른 곳에서 쓰이면 남겨두고, 상세 API는 findProjectDetail 사용)
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
      throw new Error('PROJECT_NOT_FOUND');
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
      throw new Error('PROJECT_NOT_FOUND');
    }

    return prisma.project.update({
      where: { id },
      data,
    });
  }
}

export default new ProjectRepository();
