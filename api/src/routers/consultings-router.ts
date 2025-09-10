import { Router } from 'express';
import { allow } from '../middlewares/allow-middleware';
import { UserRole } from '../enums/user-role-enum';
import {
  handleCreateConsulting,
  handleDeleteConsulting,
  handleGetConsultingDetail,
  handleGetConsultingList,
  handleUpdateConsulting,
} from '../controllers/consultings-controller';

const consultingRouter = Router();

consultingRouter.get('/', allow([UserRole.User]), handleGetConsultingList);
consultingRouter.get('/:id', allow([UserRole.User]), handleGetConsultingDetail);
consultingRouter.post('/', allow([UserRole.None]), handleCreateConsulting);
consultingRouter.patch('/:id', allow([UserRole.User]), handleUpdateConsulting);
consultingRouter.delete('/:id', allow([UserRole.User]), handleDeleteConsulting);

export default consultingRouter;
