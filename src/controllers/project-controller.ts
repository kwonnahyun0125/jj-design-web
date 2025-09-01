import { RequestHandler } from 'express';
import { successResponse } from '../utils/response-util';
import {
  createProject,
  deleteProject,
  getProjectDetail,
  getProjectList,
  updateProject,
} from '../services/project-service';

export const handleGetProjectList: RequestHandler = async (req, res) => {
  const projects = await getProjectList(req);
  return res.json(successResponse(projects));
};

export const handleCreateProject: RequestHandler = async (req, res) => {
  const project = await createProject(req);
  return res.status(201).json(successResponse(project));
};

export const handleGetProjectDetail: RequestHandler = async (req, res) => {
  const project = await getProjectDetail(req);
  return res.json(successResponse(project));
};

export const handleUpdateProject: RequestHandler = async (req, res) => {
  const project = await updateProject(req);
  return res.json(successResponse(project));
};

export const handleDeleteProject: RequestHandler = async (req, res) => {
  const project = await deleteProject(req);
  return res.json(successResponse(project));
};

/* 
const projectService = new ProjectService();

export const createProject: RequestHandler = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body);
    return res.status(201).json(successResponse(project));
  } catch (error) {
    return next(error);
  }
};

// 목록조회
export const getProjects: RequestHandler = async (req, res, next) => {
  try {
    const page = toNumber(req.query.page, 1, 1);
    const pageSize = toNumber(req.query.pageSize, 12, 1, 100);
    const q = toString(req.query.q);
    const parsedType = parseProjectType(req.query.type); // 없으면 undefined

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
    if (!id) throw new BadRequestError('Invalid id');

    const projectDetail = await projectService.getProjectById(id);
    if (!projectDetail) throw new NotFoundError('Project not found');

    return res.json(successResponse(projectDetail));
  } catch (error) {
    return next(error);
  }
};

// 수정
export const updateProject: RequestHandler = async (req, res, next) => {
  try {
    const id = toId(req.params.id);
    if (!id) throw new BadRequestError('Invalid id');

    type UpdateArg = Parameters<(typeof projectService)['updateProject']>[1];
    const project = await projectService.updateProject(id, req.body as UpdateArg);

    return res.json(successResponse(project));
  } catch (error) {
    return next(error);
  }
};

// 삭제(소프트)
export const deleteProject: RequestHandler = async (req, res, next) => {
  try {
    const id = toId(req.params.id);
    if (!id) throw new BadRequestError('Invalid id');

    const result = await projectService.deleteProject(id);
    return res.json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};
 */
