import { RequestHandler } from 'express';
import { successResponse } from '../utils/response-util';
import { ProjectService } from '../services/project-service';
import { toNumber, toString, toNumberArray, parseProjectType } from '../utils/query-parser';

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
    // 쿼리 파싱 (공용 유틸 사용)
    const page = toNumber(req.query.page, 1, 1);
    const pageSize = toNumber(req.query.pageSize, 12, 1, 100);
    const q = toString(req.query.q);
    const type = parseProjectType(req.query.type) ?? 'RESIDENCE'; // 기본값 설정
    const tagIds = toNumberArray(req.query.tagIds); // "1,2,3" → [1,2,3]

    const result = await projectService.getProjects({
      page,
      pageSize,
      q,
      type,
      tagIds,
    });

    res.json(successResponse(result));
  } catch (error) {
    next(error);
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

    const project = await projectService.getProjectById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    res.json(successResponse(project));
  } catch (error) {
    next(error);
  }
};

// 수정
export const updateProject: RequestHandler = async (req, res, next) => {
  try {
    const id = toId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }

    // 서비스 메서드 시그니처에 맞춰 body 전달
    type UpdateArg = Parameters<(typeof projectService)['updateProject']>[1];
    const project = await projectService.updateProject(id, req.body as UpdateArg);

    res.json(successResponse(project));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'PROJECT_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    next(error);
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
    res.json(successResponse(result));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'PROJECT_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    next(error);
  }
};
