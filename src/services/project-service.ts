import { Prisma } from '@prisma/client';
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

  async getProjectById(id: number) {
    return await this.projectRepository.findProjectById(id);
  }

  async updateProject(id: number, data: Prisma.ProjectUpdateInput) {
    return await this.projectRepository.updateProject(id, data);
  }

  async deleteProject(id: number) {
    return await this.projectRepository.softDeleteProject(id);
  }
}
