import { ProjectRepository } from '../repositories/project-repository';
import { CreateProjectDto, GetProjectsQuery } from '../types/project-type';

export class ProjectService {
  private projectRepository = new ProjectRepository();

  async createProject(data: CreateProjectDto) {
    // todo: 검증 코드 작성

    return await this.projectRepository.createProject(data);
  }
  async getProjects(query: GetProjectsQuery) {
    return await this.projectRepository.findProjects(query);
  }
}
