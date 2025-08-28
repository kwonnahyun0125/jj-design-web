import { Router } from 'express';
import { allow } from '../middlewares/allow-middleware';
import { UserRole } from '../enums/user-role-enum';
import {
  handleCreateConsulting,
  handleDeleteConsulting,
  handleGetConsultingList,
  handleUpdateConsulting,
} from '../controllers/consultings-controller';

const consultingRouter = Router();

consultingRouter.get('/consultings', allow([UserRole.User]), handleGetConsultingList);
consultingRouter.post('/consultings', allow([UserRole.None]), handleCreateConsulting);
consultingRouter.patch('/consultings/:id', allow([UserRole.User]), handleUpdateConsulting);
consultingRouter.delete('/consultings/:id', allow([UserRole.User]), handleDeleteConsulting);

export default consultingRouter;
