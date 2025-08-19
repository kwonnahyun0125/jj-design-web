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
