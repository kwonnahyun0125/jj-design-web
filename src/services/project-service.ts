import { ProjectRepository } from '../repositories/project-repository';
import { Prisma } from '../generated/prisma';
import { GetProjectsQuery } from '../types/project-type';

export class ProjectService {
  private projectRepository = new ProjectRepository();

  async createProject(data: Prisma.ProjectCreateInput) {
    return await this.projectRepository.createProject(data);
  }
  async getProjects(query: GetProjectsQuery) {
    return await this.projectRepository.findProjects(query);
  }
}
export { GetProjectsQuery };
