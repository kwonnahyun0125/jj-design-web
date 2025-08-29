import { Router } from 'express';
import { ShowroomController } from '../controllers/showroom.controller';

const router = Router();

router.post('/showrooms', ShowroomController.create);
router.get('/showrooms', ShowroomController.list);
router.get('/showrooms/:id', ShowroomController.getById);
router.patch('/showrooms/:id', ShowroomController.update);
router.delete('/showrooms/:id', ShowroomController.remove);

export default router;
