import { Router, NextFunction, Request, Response } from 'express';

import { validationMiddleware } from '../middleware/validation';
import { RequestWithUser } from '../utils/types';
import { CreateCategoryDto } from './dto';
import { categoriesService } from './service';

export const categoriesRouter = Router();

categoriesRouter.get(
  '/',
  async function getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as RequestWithUser;
      const categories = await categoriesService.getAllCategories(userId);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },
);

categoriesRouter.post(
  '/',
  validationMiddleware(CreateCategoryDto),
  async function createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as RequestWithUser;
      const createCategoryDto: CreateCategoryDto = req.body;
      const category = await categoriesService.createCategory(userId, createCategoryDto);

      res.json(category);
    } catch (error) {
      next(error);
    }
  },
);
