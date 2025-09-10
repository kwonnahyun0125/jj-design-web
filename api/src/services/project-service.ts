import { Request } from 'express';
import {
  createProjectWithTransaction,
  deleteProjectWithId,
  getProjectDetailWithId,
  getProjectListWithFilter,
  updateProjectWithTransaction,
} from '../repositories/project-repository';

export const getProjectList = async (req: Request) => {
  const { query } = req;
  return await getProjectListWithFilter(query);
};

export const createProject = async (req: Request) => {
  const { body } = req;
  return await createProjectWithTransaction(body);
};

export const getProjectDetail = async (req: Request) => {
  const { params } = req;
  const { id } = params;
  return await getProjectDetailWithId(Number(id));
};

export const updateProject = async (req: Request) => {
  const { params, body } = req;
  const { id } = params;
  return await updateProjectWithTransaction(Number(id), body);
};

export const deleteProject = async (req: Request) => {
  const { params } = req;
  const { id } = params;
  return await deleteProjectWithId(Number(id));
};
