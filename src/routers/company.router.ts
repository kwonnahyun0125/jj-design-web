import express from 'express';
import { handleGetCompany, handleUpdateCompany } from '../controllers/company.controller';
import { allow } from '../middlewares/allow-middleware';
import { UserRole } from '../enums/user-role-enum';

const companyRouter = express.Router();

companyRouter.get('/', allow([UserRole.None]), handleGetCompany);
companyRouter.patch('/', allow([UserRole.User]), handleUpdateCompany);

export default companyRouter;
