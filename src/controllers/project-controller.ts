import { RequestHandler } from 'express';
import { successResponse } from '../utils/response-util';
import { ProjectService } from '../services/project-service';

const projectService = new ProjectService();

export const createProject: RequestHandler = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(successResponse(project));
  } catch (error) {
    next(error);
  }
};

export const getProjects: RequestHandler = async (req, res, next) => {
  try {
    // 쿼리 파싱
    const page = toNumber(req.query.page, 1, 1);
    const pageSize = toNumber(req.query.pageSize, 12, 1, 100);
    const q = toString(req.query.q);
    const type = toProjectType(req.query.type); // 'RESIDENCE' | 'MERCANTILE' | 'ARCHITECTURE' | undefined
    const tagIds = toNumberArray(req.query.tagIds); // "1,2,3" → [1,2,3]
    const includeImages = toBool(req.query.includeImages); // '1'|'0' → boolean|undefined
    const includeTags = toBool(req.query.includeTags);

    const result = await projectService.getProjects({
      page,
      pageSize,
      q,
      type,
      tagIds,
      includeImages,
      includeTags,
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

function toNumber(v: unknown, fallback = 1, min?: number, max?: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  const boundedMin = min !== undefined ? Math.max(min, n) : n;
  const bounded = max !== undefined ? Math.min(max, boundedMin) : boundedMin;
  return bounded;
}

function toString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v : undefined;
}

function toNumberArray(v: unknown): number[] | undefined {
  if (typeof v !== 'string' || !v.trim()) return undefined;
  const arr = v
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));
  return arr.length ? arr : undefined;
}

function toBool(v: unknown): boolean | undefined {
  if (v === '1') return true;
  if (v === '0') return false;
  return undefined;
}

type ProjectType = 'RESIDENCE' | 'MERCANTILE' | 'ARCHITECTURE';

function toProjectType(v: unknown): ProjectType {
  if (typeof v !== 'string') return 'RESIDENCE';
  const allowed = ['RESIDENCE', 'MERCANTILE', 'ARCHITECTURE'] as const;
  return allowed.includes(v as (typeof allowed)[number]) ? (v as ProjectType) : 'RESIDENCE';
}
