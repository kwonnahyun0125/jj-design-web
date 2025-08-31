import type { RequestHandler } from 'express';
import { ShowroomService } from '../services/showroom.service';
import { successResponse } from '../utils/response-util';
import {
  listQuerySchema,
  createShowroomSchema,
  updateShowroomSchema,
} from '../types/showroom.type';

const showroomService = new ShowroomService();

export const createShowroom: RequestHandler = async (req, res, next) => {
  try {
    const body = createShowroomSchema.parse(req.body);
    const created = await showroomService.createShowroom(body);
    return res.status(201).json(successResponse(created));
  } catch (e) {
    return next(e);
  }
};

export const getShowrooms: RequestHandler = async (req, res, next) => {
  try {
    const q = listQuerySchema.parse(req.query);
    const data = await showroomService.getShowrooms(q);
    return res.status(200).json(successResponse(data));
  } catch (e) {
    return next(e);
  }
};

export const getShowroomById: RequestHandler = async (req, res, next) => {
  try {
    const data = await showroomService.getShowroomById(Number(req.params.id));
    return res.status(200).json(successResponse(data));
  } catch (e) {
    return next(e);
  }
};

export const updateShowroom: RequestHandler = async (req, res, next) => {
  try {
    const body = updateShowroomSchema.parse(req.body);
    const data = await showroomService.updateShowroom(Number(req.params.id), body);
    return res.status(200).json(successResponse(data));
  } catch (e) {
    return next(e);
  }
};

export const deleteShowroom: RequestHandler = async (req, res, next) => {
  try {
    const data = await showroomService.deleteShowroom(Number(req.params.id));
    return res.status(200).json(successResponse(data));
  } catch (e) {
    return next(e);
  }
};
