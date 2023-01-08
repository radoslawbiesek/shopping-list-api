import { Router, NextFunction, Request, Response } from 'express';

import { validationMiddleware } from '../middleware/validation';
import { RequestWithUser } from '../utils/types';
import { CreateProductDto } from './dto';
import { productsService } from './service';

export const productsRouter = Router();

productsRouter.post(
  '/',
  validationMiddleware(CreateProductDto),
  async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as RequestWithUser;
      const createProductDto: CreateProductDto = req.body;
      const product = await productsService.createProduct(userId, createProductDto);

      res.json(product);
    } catch (error) {
      next(error);
    }
  },
);
