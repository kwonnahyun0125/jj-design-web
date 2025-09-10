import { Request, Response } from 'express';
import { successResponse } from '../utils/response-util';
import { getCompany, updateCompany } from '../services/company.service';

export const handleGetCompany = async (req: Request, res: Response) => {
  const data = await getCompany(req);

  res.status(200).json(successResponse(data));
};

export const handleUpdateCompany = async (req: Request, res: Response) => {
  const data = await updateCompany(req);

  res.status(200).json(successResponse(data));
};
