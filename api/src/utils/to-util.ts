import { Category, Keyword } from '@prisma/client';
import { Lineup, Pyung } from '../types/project-type';

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
    case 'OFFICE':
      return Keyword.OFFICE;
    case 'NEW':
      return Keyword.NEW;
    case 'REMODELING':
      return Keyword.REMODELING;
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

export const toSizeRanges = (
  pyungArray: Pyung[] | undefined
): { OR: { size: { gte?: number; lt?: number } }[] } | undefined => {
  if (!pyungArray || pyungArray.length === 0) {
    return undefined;
  }
  // pyungArray가 배열이 아니면 배열로 변환
  const arr = Array.isArray(pyungArray) ? pyungArray : [pyungArray];

  const ranges: { size: { gte?: number; lt?: number } }[] = [];

  arr.forEach((pyung) => {
    switch (pyung) {
      case '20':
        ranges.push({ size: { gte: 20, lt: 30 } });
        break;
      case '30':
        ranges.push({ size: { gte: 30, lt: 40 } });
        break;
      case '40':
        ranges.push({ size: { gte: 40, lt: 50 } });
        break;
      case '50':
        ranges.push({ size: { gte: 50, lt: 60 } });
        break;
      case '60':
        ranges.push({ size: { gte: 60, lt: 70 } });
        break;
      case 'OTHER':
        ranges.push({ size: { lt: 20 } });
        ranges.push({ size: { gte: 70 } });
        break;
    }
  });

  return ranges.length > 0 ? { OR: ranges } : undefined;
};
