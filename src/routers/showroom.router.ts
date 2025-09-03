import { Router } from 'express';
import {
  createShowroom,
  getShowrooms,
  getShowroomById,
  updateShowroom,
  deleteShowroom,
} from '../controllers/showroom.controller';
import { allow } from '../middlewares/allow-middleware';
import { UserRole } from '../enums/user-role-enum';

const router = Router();

router.post('/showrooms', allow([UserRole.User]), createShowroom);
router.get('/showrooms', allow([UserRole.User]), getShowrooms);
router.get('/showrooms/:id', allow([UserRole.User]), getShowroomById);
router.patch('/showrooms/:id', allow([UserRole.User]), updateShowroom);
router.delete('/showrooms/:id', allow([UserRole.User]), deleteShowroom);

export default router;
