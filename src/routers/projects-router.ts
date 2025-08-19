import express from 'express';
import { createProject } from '../controllers/project-controller';

const projects = express.Router();

projects.post('/projects', createProject);

export default projects;
