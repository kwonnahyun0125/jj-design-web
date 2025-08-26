import express from 'express';
import {
  createProjectImage,
  deleteProjectImage,
  updateProjectImageKeywords,
} from '../controllers/project-image-controller';

const projectImages = express.Router();

projectImages.post('/projectImages', createProjectImage);
projectImages.delete('/projectImages/:id', deleteProjectImage);
projectImages.patch('/projectImages/:id/keywords', updateProjectImageKeywords);

export default projectImages;
