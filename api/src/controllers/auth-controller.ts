import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../utils/response-util';
import { refresh, signin } from '../services/auth-service';

export const handleSignin = async (req: Request, res: Response, _next: NextFunction) => {
  const data = await signin(req);

  res.status(200).json(successResponse(data));
};

export const handleRefresh = async (req: Request, res: Response, _next: NextFunction) => {
  const data = await refresh(req);

  res.status(200).json(successResponse(data));
};
