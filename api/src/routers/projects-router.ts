import express from 'express';
import {
  handleCreateProject,
  handleDeleteProject,
  handleGetProjectDetail,
  handleGetProjectList,
  handleUpdateProject,
} from '../controllers/project-controller';
import { allow } from '../middlewares/allow-middleware';
import { UserRole } from '../enums/user-role-enum';

const projects = express.Router();

projects.post('/', allow([UserRole.User]), handleCreateProject);
projects.get('/', allow([UserRole.None]), handleGetProjectList);
projects.get('/:id', allow([UserRole.None]), handleGetProjectDetail);
projects.patch('/:id', allow([UserRole.User]), handleUpdateProject);
projects.delete('/:id', allow([UserRole.User]), handleDeleteProject);

export default projects;
