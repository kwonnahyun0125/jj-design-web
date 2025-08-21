import express from 'express';
import { createProject, getProjects } from '../controllers/project-controller';

const projects = express.Router();

projects.post('/projects', createProject);
projects.get('/projects', getProjects);

export default projects;
