import { RequestHandler } from 'express';
import { successResponse } from '../utils/response-util';
import { ProjectService } from '../services/project-service';
import { toNumber, toString, parseProjectType } from '../utils/query-parser';

const projectService = new ProjectService();

export const createProject: RequestHandler = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(successResponse(project));
  } catch (error) {
    next(error);
  }
};

// 목록조회
export const getProjects: RequestHandler = async (req, res, next) => {
  try {
    const page = toNumber(req.query.page, 1, 1);
    const pageSize = toNumber(req.query.pageSize, 12, 1, 100);
    const q = toString(req.query.q);
    const parsedType = parseProjectType(req.query.type); // 없으면 null/undefined

    const result = await projectService.getProjects({
      page,
      pageSize,
      q,
      ...(parsedType ? { type: parsedType } : {}),
    });

    return res.json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};

// 내부 유틸: path param id 파싱
const toId = (v: unknown): number | null => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const getProjectById: RequestHandler = async (req, res, next) => {
  try {
    const id = toId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }

    const projectDetail = await projectService.getProjectById(id);
    if (!projectDetail) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    return res.json(successResponse(projectDetail));
  } catch (error) {
    return next(error);
  }
};

// 수정
export const updateProject: RequestHandler = async (req, res, next) => {
  try {
    const id = toId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }

    type UpdateArg = Parameters<(typeof projectService)['updateProject']>[1];
    const project = await projectService.updateProject(id, req.body as UpdateArg);

    return res.json(successResponse(project));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'PROJECT_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    return next(error);
  }
};

// 삭제(소프트)
export const deleteProject: RequestHandler = async (req, res, next) => {
  try {
    const id = toId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }

    const result = await projectService.deleteProject(id);
    return res.json(successResponse(result));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'PROJECT_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    return next(error);
  }
};
