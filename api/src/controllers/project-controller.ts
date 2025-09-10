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
