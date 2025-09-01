import { Category, Keyword } from '@prisma/client';
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
