import { ProjectImage, ProjectType } from '@prisma/client';

export interface CreateProjectDto {
  title: string;
  areaSize: number;
  type: ProjectType;
  description?: string;
  durationWeeks?: number;
  reviews?: string;
  imageUrl?: string;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;

// 조회 쿼리: tagIds → keywordIds 로 전환 (AND 필터)
export type GetProjectsQuery = {
  page: number; // 1+
  pageSize: number; // 1~100
  q?: string; // 제목/설명 검색
  type: ProjectType; // 프로젝트 타입 필터
  keywordIds?: number[]; // AND 필터 (모든 keyword 포함)
};

// 목록조회 결과 항목
export type ProjectList = {
  id: number;
  title: string;
  areaSize: number;
  type: ProjectType;
  createdAt: string; // ISO 문자열로 노출
  imageUrl?: string;
};

// 상세조회 결과 항목
export type ProjectDetail = ProjectList & {
  description?: string;
  durationWeeks?: number;
  reviews?: string;
  images?: ProjectImage[];
  // 기존 tags 제거 (Tag → Keyword 전환)
};

// 페이징 결과 공용 타입
export type Paged<T> = {
  page: number;
  pageSize: number;
  total: number;
  rows: T[];
};
