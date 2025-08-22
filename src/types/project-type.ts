import { ProjectType } from '../generated/prisma';
export interface CreateProjectDto {
  title: string;
  areaSize: number;
  type: ProjectType;
  description?: string;
  durationWeeks?: number;
  reviews?: string;
  imageUrl?: string;
  projectTags?: string[];
  projectImages?: string[];
}

export type GetProjectsQuery = {
  page: number; // 1+
  pageSize: number; // 1~100
  q?: string; // 제목/설명 검색
  type: ProjectType;
  tagIds?: number[]; // AND 필터 (모든 tag 포함)
  includeImages?: boolean; // 프로젝트-이미지 조인 포함
  includeTags?: boolean; // 프로젝트-태그 조인 포함
};
