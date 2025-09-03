import { Router } from 'express';
import {
  createFurniture,
  getFurnitures,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
} from '../controllers/furniture.controller';
import { allow } from '../middlewares/allow-middleware';
import { UserRole } from '../enums/user-role-enum';

const router = Router();

router.post('/furnitures', allow([UserRole.User]), createFurniture);
router.get('/furnitures', allow([UserRole.User]), getFurnitures);
router.get('/furnitures/:id', allow([UserRole.User]), getFurnitureById);
router.patch('/furnitures/:id', allow([UserRole.User]), updateFurniture);
router.delete('/furnitures/:id', allow([UserRole.User]), deleteFurniture);

export default router;
