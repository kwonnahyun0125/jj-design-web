import { Request, Response, NextFunction } from 'express';
import { ShowroomService } from '../services/showroom.service';
import {
  listQuerySchema,
  createShowroomSchema,
  updateShowroomSchema,
} from '../types/showroom.schema';

export class ShowroomController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const q = listQuerySchema.parse(req.query);
      const data = await ShowroomService.list(q);
      res.json({ data });
    } catch (e) {
      next(e);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = await ShowroomService.getById(id);
      res.json({ data });
    } catch (e) {
      next(e);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createShowroomSchema.parse(req.body);
      const data = await ShowroomService.create(body);
      res.status(201).json({ data });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const body = updateShowroomSchema.parse(req.body);
      const data = await ShowroomService.update(id, body);
      res.json({ data });
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = await ShowroomService.remove(id);
      res.json({ data });
    } catch (e) {
      next(e);
    }
  }
}
