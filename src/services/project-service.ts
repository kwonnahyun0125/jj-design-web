import { Prisma } from '@prisma/client';
import { ProjectRepository } from '../repositories/project-repository';
import { CreateProjectDto, GetProjectsQuery } from '../types/project-type';

type ProjectImageDto = {
  id: number; // imageId
  url: string;
  keywords: string[]; // 기본값 로직 적용 후
};

type ProjectDetailDto = {
  id: number;
  title: string;
  areaSize: number;
  type: string;
  description: string | null;
  durationWeeks: number | null;
  reviews: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: ProjectImageDto[];
};

export class ProjectService {
  private projectRepository = new ProjectRepository();

  async createProject(data: CreateProjectDto) {
    // TODO: DTO 검증 로직
    return await this.projectRepository.createProject(data);
  }

  async getProjects(query: GetProjectsQuery) {
    return await this.projectRepository.findProjects(query);
  }

  // ✅ 상세 조회는 상세 DTO로 반환 (이미지+키워드 포함 & 기본값 처리)
  async getProjectById(id: number): Promise<ProjectDetailDto | null> {
    const project = await this.projectRepository.findProjectDetail(id);
    if (!project) return null;

    const images: ProjectImageDto[] =
      project.projectImages.map((pi) => {
        const names = (pi.imageKeywords?.map((ik) => ik.keyword.name) ?? []).filter(Boolean);

        return {
          id: pi.imageId,
          url: pi.image.url,
          keywords: names.length > 0 ? names : ['전체'], // 🔸 기본값 주입(응답 단계)
        };
      }) ?? [];

    return {
      id: project.id,
      title: project.title,
      areaSize: project.areaSize,
      type: project.type, // enum -> string
      description: project.description ?? null,
      durationWeeks: project.durationWeeks ?? null,
      reviews: project.reviews ?? null,
      imageUrl: project.imageUrl ?? null,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      images,
    };
  }

  async updateProject(id: number, data: Prisma.ProjectUpdateInput) {
    return await this.projectRepository.updateProject(id, data);
  }

  async deleteProject(id: number) {
    return await this.projectRepository.softDeleteProject(id);
  }
}
