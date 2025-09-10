import { Keyword } from '@prisma/client';

export type Pyung = '20' | '30' | '40' | '50' | '60' | 'OTHER';

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
  pyung?: Pyung[];
  keyword?: Keyword;
  search?: string;
  lineup?: Lineup;
};
