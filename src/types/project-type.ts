import { Keyword } from '@prisma/client';

export enum Category {
  RESIDENCE = 'RESIDENCE',
  MERCANTILE = 'MERCANTILE',
  ARCHITECTURE = 'ARCHITECTURE',
}

export enum Lineup {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
}

export interface CreateProjectRequest {
  title: string;
  size: number;
  category?: Category;
  description?: string;
  duration?: number;
  lineup?: Lineup;
  keywords?: Keyword[];
  review?: string;
  images: {
    url: string;
    tagId: number;
  }[];
}

export interface UpdateProjectRequest {
  title: string;
  size: number;
  category?: Category;
  description?: string;
  duration?: number;
  lineup?: Lineup;
  review?: string;
  keywords?: Keyword[];
  images: {
    url: string;
    tagId: number;
  }[];
}

export type GetProjectListQuery = {
  category?: Category;
  page?: number;
  size?: number;
  keyword?: Keyword;
  search?: string;
  lineup?: Lineup;
};

/* 
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

// 목록조회
export type GetProjectsQuery = {
  page: number; // 1+
  pageSize: number; // 1~100
  q?: string; // 제목/설명 검색
  type?: ProjectType; // ← 옵션!
  keywordIds?: number[]; // AND 필터 (모든 keyword 포함) - 그대로 유지
};

// 목록조회 결과 항목
export type ProjectList = {
  id: number;
  title: string;
  areaSize: number;
  type: ProjectType;
  createdAt: Date;
  imageUrl?: string | null;
};

// 상세 이미지 DTO
export type ProjectImageDto = {
  id: number;
  url: string;
  keywords: string[]; // 기본값 주입 후 ['전체'] 가능
};

// 상세조회 결과 항목
export type ProjectDetail = ProjectList & {
  description?: string | null;
  durationWeeks?: number | null;
  reviews?: string | null;
  images: ProjectImageDto[];
};

// 페이징 결과 공용 타입
export type Paged<T> = {
  page: number;
  pageSize: number;
  total: number;
  rows: T[];
};
 */
