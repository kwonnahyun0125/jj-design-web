import { Keyword } from '@prisma/client';
import prisma from '../config/db';
import {
  Category,
  CreateProjectRequest,
  GetProjectListQuery,
  UpdateProjectRequest,
} from '../types/project-type';
import { getDefaultTagsByType } from '../utils/from-util';
import { toCategory, toKeyword, toLineup } from '../utils/to-util';

export const createProjectWithTransaction = async (data: CreateProjectRequest) => {
  return await prisma.$transaction(async (tx) => {
    const keywordList = data.keywords
      ?.map((keyword) => toKeyword(keyword))
      .filter(Boolean) as Keyword[];

    let project = await tx.project.create({
      data: {
        title: data.title,
        size: data.size,
        category: data.category ?? 'RESIDENCE',
        description: data.description,
        duration: data.duration,
        keywords: keywordList,
        lineup: data.lineup ?? 'FULL',
        review: data.review,
        imageUrl: null,
      },
    });

    // 기본 태그 등록
    const defaultTags = await getDefaultTagsByType(data.category ?? Category.RESIDENCE);

    if (defaultTags.length) {
      await tx.projectTag.createMany({
        data: defaultTags.map((tagId) => ({
          projectId: project.id,
          tagId: Number(tagId),
        })),
        skipDuplicates: true,
      });
    }

    // 이미지 등록
    if (data.images?.length) {
      for (const img of data.images) {
        const image = await tx.image.create({
          data: { url: img.url },
        });

        await tx.projectImage.create({
          data: {
            projectId: project.id,
            imageId: image.id,
            tagId: Number(img.tagId),
          },
        });
      }

      project = await tx.project.update({
        where: { id: project.id },
        data: { imageUrl: data.images[0].url },
      });
    }

    return project;
  });
};

export const getProjectListWithFilter = async (query: GetProjectListQuery) => {
  const { category = Category.RESIDENCE, page = 1, size = 10, keyword, search, lineup } = query;

  const categoryEnum = toCategory(category);
  const keywordEnum = toKeyword(keyword);
  const lineupEnum = toLineup(lineup);

  const where = {
    isDeleted: false,
    ...(keywordEnum ? { keywords: { has: keywordEnum } } : {}),
    category: categoryEnum,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(lineupEnum ? { lineup: lineupEnum } : {}),
  };

  const [totalCount, list] = await Promise.all([
    prisma.project.count({
      where,
    }),
    prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * size,
      take: size,
    }),
  ]);

  return { totalCount, list };
};

export const getProjectDetailWithId = async (id: number) => {
  return await prisma.project.findFirst({
    where: { id, isDeleted: false },
    include: {
      images: {
        where: { image: { isDeleted: false } },
        include: {
          image: true,
        },
      },
    },
  });
};
export const updateProjectWithTransaction = async (id: number, data: UpdateProjectRequest) => {
  return await prisma.$transaction(async (tx) => {
    const project = await tx.project.update({
      where: { id },
      data: {
        title: data.title,
        size: data.size,
        category: data.category ?? 'RESIDENCE',
        description: data.description,
        duration: data.duration,
        lineup: data.lineup ?? 'FULL',
        review: data.review,
      },
    });

    await tx.projectImage.deleteMany({
      where: { projectId: id },
    });

    if (data.images?.length) {
      for (const img of data.images) {
        const image = await tx.image.create({
          data: { url: img.url },
        });

        await tx.projectImage.create({
          data: {
            projectId: id,
            imageId: image.id,
            tagId: img.tagId,
          },
        });
      }

      await tx.project.update({
        where: { id },
        data: { imageUrl: data.images[0].url },
      });
    }

    return project;
  });
};

export const deleteProjectWithId = async (id: number) => {
  return await prisma.project.update({
    where: { id },
    data: { isDeleted: true },
  });
};

/* 
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
 */
