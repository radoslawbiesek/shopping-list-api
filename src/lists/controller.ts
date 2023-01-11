import { Router, NextFunction, Request, Response } from 'express';

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
