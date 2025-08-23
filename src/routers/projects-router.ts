import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project-controller';

const projects = express.Router();

projects.get('/projects', getProjects);
projects.get('/projects/:id', getProjectById);
projects.post('/projects', createProject);
projects.patch('/projects/:id', updateProject);
projects.delete('/projects/:id', deleteProject);

export default projects;
