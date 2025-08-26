import prisma from '../config/db';

export class ProjectImageRepository {
  async findProjectImageById(id: number) {
    return prisma.projectImage.findUnique({ where: { id } });
  }

  async createProjectImage(projectId: number, imageUrl: string) {
    return await prisma.projectImage.create({
      data: {
        project: {
          connect: { id: projectId },
        },
        image: {
          create: {
            url: imageUrl,
          },
        },
      },
      include: {
        image: true,
      },
    });
  }

  async deleteProjectImage(projectImageId: number, imageId: number) {
    return prisma.$transaction([
      prisma.projectImage.delete({ where: { id: projectImageId } }),
      prisma.image.delete({ where: { id: imageId } }),
    ]);
  }

  async deleteAllKeywordsForProjectImage(projectId: number, imageId: number) {
    return prisma.projectImageKeyword.deleteMany({
      where: { projectId, imageId },
    });
  }

  async createKeywordRelations(projectId: number, imageId: number, keywordIds: number[]) {
    const data = keywordIds.map((keywordId) => ({
      projectId,
      imageId,
      keywordId,
    }));

    return prisma.projectImageKeyword.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
