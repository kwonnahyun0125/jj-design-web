import { ProjectRepository } from '../repositories/project-repository';
import { Prisma } from '../generated/prisma';

export class ProjectService {
  private projectRepository = new ProjectRepository();

  async createProject(data: Prisma.ProjectCreateInput) {
    return await this.projectRepository.createProject(data);
  }
}
