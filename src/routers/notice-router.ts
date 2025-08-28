import express from 'express';
import { allow } from '../middlewares/allow-middleware';
import { UserRole } from '../enums/user-role-enum';

import {
  createNotice,
  getNotices,
  getNoticeDetail,
  updateNotice,
  deleteNotice,
} from '../controllers/notice-controller';

const noticeRouter = express.Router();

noticeRouter.post('/notices', allow([UserRole.User]), createNotice);
noticeRouter.get('/notices', allow([UserRole.User]), getNotices);
noticeRouter.get('/notices/:id', allow([UserRole.User]), getNoticeDetail);
noticeRouter.patch('/notices/:id', allow([UserRole.User]), updateNotice);
noticeRouter.delete('/notices/:id', allow([UserRole.User]), deleteNotice);

export default noticeRouter;
