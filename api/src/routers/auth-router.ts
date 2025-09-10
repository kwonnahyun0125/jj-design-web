import { Router } from 'express';
import { allow } from '../middlewares/allow-middleware';
import { UserRole } from '../enums/user-role-enum';
import { handleSignin, handleRefresh } from '../controllers/auth-controller';

const authRouter = Router();

authRouter.post('/signin', allow([UserRole.Public]), handleSignin);
authRouter.post('/refresh', allow([UserRole.User]), handleRefresh);

export default authRouter;
