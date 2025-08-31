import { Router } from 'express';
import {
  createShowroom,
  getShowrooms,
  getShowroomById,
  updateShowroom,
  deleteShowroom,
} from '../controllers/showroom.controller';

const router = Router();

router.post('/showrooms', createShowroom);
router.get('/showrooms', getShowrooms);
router.get('/showrooms/:id', getShowroomById);
router.patch('/showrooms/:id', updateShowroom);
router.delete('/showrooms/:id', deleteShowroom);

export default router;
