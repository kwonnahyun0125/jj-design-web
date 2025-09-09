import { Request, Response } from 'express';
import { successResponse } from '../utils/response-util';
import {
  createConsulting,
  deleteConsulting,
  getConsultingDetail,
  getConsultingList,
  updateConsulting,
} from '../services/consultings-service';

export const handleCreateConsulting = async (req: Request, res: Response) => {
  const data = await createConsulting(req);

  res.status(201).json(successResponse(data));
};

export const handleGetConsultingList = async (req: Request, res: Response) => {
  const data = await getConsultingList(req);

  res.status(200).json(successResponse(data));
};

export const handleGetConsultingDetail = async (req: Request, res: Response) => {
  const data = await getConsultingDetail(req);

  res.status(200).json(successResponse(data));
};

export const handleUpdateConsulting = async (req: Request, res: Response) => {
  const data = await updateConsulting(req);

  res.status(200).json(successResponse(data));
};

export const handleDeleteConsulting = async (req: Request, res: Response) => {
  const data = await deleteConsulting(req);

  res.status(200).json(successResponse(data));
};
