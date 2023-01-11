import { Router, NextFunction, Request, Response } from 'express';
import { CreateListProductDto, CreateListProductParams } from '../lists-products/dto';
import { listsProductsService } from '../lists-products/service';

import { validationMiddleware } from '../middleware/validation';
import { RequestWithUser } from '../utils/types';
import { CreateListDto } from './dto';
import { listsService } from './service';

export const listsRouter = Router();

listsRouter
  .route('/')
  .get(async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as RequestWithUser;
      const lists = await listsService.getAll(userId);

      res.json(lists);
    } catch (error) {
      next(error);
    }
  })
  .post(
    validationMiddleware(CreateListDto),
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const { userId } = req as RequestWithUser;
        const createListDto: CreateListDto = req.body;
        const list = await listsService.create(userId, createListDto);

        res.json(list);
      } catch (error) {
        next(error);
      }
    },
  );

listsRouter
  .route('/:list_id/product')
  .post(
    validationMiddleware(CreateListProductParams, 'params'),
    validationMiddleware(CreateListProductDto),
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const { userId } = req as RequestWithUser;
        const { list_id } = req.params as unknown as CreateListProductParams;
        const createListProductDto: CreateListProductDto = req.body;

        const listProduct = await listsProductsService.create(
          userId,
          list_id,
          createListProductDto,
        );

        res.json(listProduct);
      } catch (error) {
        next(error);
      }
    },
  )
  .get(
    validationMiddleware(CreateListProductParams, 'params'),
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const { userId } = req as RequestWithUser;
        const { list_id } = req.params as unknown as CreateListProductParams;
        const listProducts = await listsProductsService.getAll(userId, list_id);

        res.json(listProducts);
      } catch (error) {
        next(error);
      }
    },
  );
