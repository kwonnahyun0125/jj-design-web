import prisma from '../config/db';
import { Prisma } from '@prisma/client';
import { CreateProjectDto, GetProjectsQuery } from '../types/project-type';

export class ProjectRepository {
  async createProject(data: CreateProjectDto) {
    const {
      title,
      areaSize,
      type,
      description,
      durationWeeks,
      reviews,
      imageUrl,
      projectTags,
      projectImages,
    } = data;

    return await prisma.project.create({
      data: {
        title,
        areaSize,
        type,
        description,
        durationWeeks,
        reviews,
        imageUrl,
        projectTags: projectTags
          ? {
              create: projectTags.map((name) => ({
                tag: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,

        projectImages: projectImages
          ? {
              create: projectImages.map((url) => ({
                image: {
                  create: { url },
                },
              })),
            }
          : undefined,
      },
      include: {
        projectTags: { include: { tag: true } },
        projectImages: { include: { image: true } },
      },
    });
  }

  async findProjects(query: GetProjectsQuery) {
    const and: Prisma.ProjectWhereInput[] = [{ isdeleted: false }];

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
      and.push({ type: query.type });
    }

    if (query.tagIds && query.tagIds.length > 0) {
      // 모든 tagIds를 포함하는 프로젝트
      and.push({
        projectTags: {
          every: { tagId: { in: query.tagIds } },
        },
      });
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
        include: {
          projectImages: query.includeImages ? { include: { image: true } } : false,
          projectTags: query.includeTags ? { include: { tag: true } } : false,
        },
      }),
    ]);

    return { page, pageSize, total, rows };
  }
}
