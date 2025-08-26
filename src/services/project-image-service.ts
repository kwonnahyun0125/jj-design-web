import { ProjectImageRepository } from '../repositories/project-image-repository';
import { BadRequestError } from '../types/error-type';

export class ProjectImageService {
  private projectImageRepository = new ProjectImageRepository();

  async createProjectImage(projectId: number, imageUrl: string) {
    return await this.projectImageRepository.createProjectImage(projectId, imageUrl);
  }

  async deleteProjectImage(projectImageId: number) {
    const projectImage = await this.projectImageRepository.findProjectImageById(projectImageId);
    if (!projectImage) throw new BadRequestError();

    const { imageId } = projectImage;

    await this.projectImageRepository.deleteProjectImage(projectImageId, imageId);

    return { deleted: true };
  }

  async updateProjectImageKeywords(projectImageId: number, keywordIds: number[]) {
    const projectImage = await this.projectImageRepository.findProjectImageById(projectImageId);
    if (!projectImage) throw new BadRequestError();

    const { projectId, imageId } = projectImage;

    await this.projectImageRepository.deleteAllKeywordsForProjectImage(projectId, imageId);

    if (keywordIds.length > 0) {
      await this.projectImageRepository.createKeywordRelations(projectId, imageId, keywordIds);
    }

    return { updated: true };
  }
}
