import { Router, NextFunction, Request, Response } from 'express';

import { validationMiddleware } from '../middleware/validation';
import { RequestWithUser } from '../utils/types';
import { GetAllProductsQuery, CreateProductDto } from './dto';
import { productsService } from './service';

export const productsRouter = Router();

productsRouter
  .route('/')
  .get(
    validationMiddleware(GetAllProductsQuery, 'query'),
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const { userId } = req as RequestWithUser;
        const getAllProductsQuery: GetAllProductsQuery = req.query;
        const products = await productsService.getAll(userId, getAllProductsQuery);

        res.json(products);
      } catch (error) {
        next(error);
      }
    },
  )
  .post(
    validationMiddleware(CreateProductDto),
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const { userId } = req as RequestWithUser;
        const createProductDto: CreateProductDto = req.body;
        const product = await productsService.create(userId, createProductDto);

        res.json(product);
      } catch (error) {
        next(error);
      }
    },
  );
