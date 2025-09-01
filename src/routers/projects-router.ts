import express from 'express';
import {
  handleCreateProject,
  handleDeleteProject,
  handleGetProjectDetail,
  handleGetProjectList,
  handleUpdateProject,
} from '../controllers/project-controller';

const projects = express.Router();

projects.post('/', handleCreateProject);
projects.get('/', handleGetProjectList);
projects.get('/:id', handleGetProjectDetail);
projects.patch('/:id', handleUpdateProject);
projects.delete('/:id', handleDeleteProject);

export default projects;
