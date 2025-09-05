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
