import { Category, Keyword, Size } from '@prisma/client';
import { Lineup } from '../types/project-type';

export const bytesToMB = (bytes: number): string => (bytes / 1024 / 1024).toFixed(2) + 'MB';

export const toCategory = (category: string | undefined): Category => {
  switch (category) {
    case 'RESIDENCE':
    case '100':
      return Category.RESIDENCE;
    case 'MERCANTILE':
    case '200':
      return Category.MERCANTILE;
    case 'ARCHITECTURE':
    case '300':
      return Category.ARCHITECTURE;
    default:
      return Category.RESIDENCE;
  }
};

export const toKeyword = (keyword: string | undefined): Keyword | undefined => {
  switch (keyword) {
    case 'APART':
      return Keyword.APART;
    case 'HOUSE':
      return Keyword.HOUSE;
    case 'COMMERCIAL':
      return Keyword.COMMERCIAL;
    case 'NEW':
      return Keyword.NEW;
    default:
      return undefined;
  }
};

export const toLineup = (lineup: string | undefined): Lineup | undefined => {
  switch (lineup) {
    case 'FULL':
      return Lineup.FULL;
    case 'PARTIAL':
      return Lineup.PARTIAL;
    default:
      return undefined;
  }
};

export const toSizeTag = (sizeTag: string | undefined): string | undefined => {
  switch (sizeTag) {
    case 'SIZE20':
      return Size.SIZE20;
    case 'SIZE30':
      return Size.SIZE30;
    case 'SIZE40':
      return Size.SIZE40;
    case 'SIZE50':
      return Size.SIZE50;
    case 'SIZE60':
      return Size.SIZE60;
    case 'OTHER':
      return Size.OTHER;
    default:
      return undefined;
  }
};

export const toSizeRange = (
  sizeTag: string | undefined
): { gte?: number; lt?: number } | undefined => {
  switch (sizeTag) {
    case '20':
      return { gte: 20, lt: 30 };
    case '30':
      return { gte: 30, lt: 40 };
    case '40':
      return { gte: 40, lt: 50 };
    case '50':
      return { gte: 50, lt: 60 };
    case '60':
      return { gte: 60, lt: 70 };
    case 'OTHER':
      return { lt: 20, gte: 70 };
    default:
      return undefined;
  }
};
