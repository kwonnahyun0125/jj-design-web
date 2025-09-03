import type { RequestHandler } from 'express';
import { FurnitureService } from '../services/furniture.service';
import { successResponse } from '../utils/response-util';
import {
  listFurnitureQuerySchema,
  createFurnitureSchema,
  updateFurnitureSchema,
} from '../types/furniture.type';

const furnitureService = new FurnitureService();

export const createFurniture: RequestHandler = async (req, res, next) => {
  try {
    const body = createFurnitureSchema.parse(req.body);
    const created = await furnitureService.createFurniture(body);
    return res.status(201).json(successResponse(created));
  } catch (e) {
    return next(e);
  }
};

export const getFurnitures: RequestHandler = async (req, res, next) => {
  try {
    const q = listFurnitureQuerySchema.parse(req.query);
    const data = await furnitureService.getFurnitures(q);
    return res.status(200).json(successResponse(data));
  } catch (e) {
    return next(e);
  }
};

export const getFurnitureById: RequestHandler = async (req, res, next) => {
  try {
    const data = await furnitureService.getFurnitureById(Number(req.params.id));
    return res.status(200).json(successResponse(data));
  } catch (e) {
    return next(e);
  }
};

export const updateFurniture: RequestHandler = async (req, res, next) => {
  try {
    const body = updateFurnitureSchema.parse(req.body);
    const data = await furnitureService.updateFurniture(Number(req.params.id), body);
    return res.status(200).json(successResponse(data));
  } catch (e) {
    return next(e);
  }
};

export const deleteFurniture: RequestHandler = async (req, res, next) => {
  try {
    const data = await furnitureService.deleteFurniture(Number(req.params.id));
    return res.status(200).json(successResponse(data));
  } catch (e) {
    return next(e);
  }
};
