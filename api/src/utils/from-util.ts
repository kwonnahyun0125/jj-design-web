import { Request } from 'express';
import { Category } from '../types/project-type';

export const getIp = (req: Request): string => req.ip || 'unknown';
export const getUrl = (req: Request): string => req.url || 'unknown';
export const getMethod = (req: Request): string => req.method || 'unknown';

export const getDefaultTagsByType = (type: Category): number[] => {
  switch (type) {
    case Category.RESIDENCE:
      return [101, 102, 103, 104, 105, 106];
    case Category.MERCANTILE:
      return [201, 202, 203, 204, 205];
    case Category.ARCHITECTURE:
      return [301, 302, 303];
    default:
      return [];
  }
};
