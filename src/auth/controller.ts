import { Router, NextFunction, Request, Response } from 'express';

import { CreateUserDto } from '../users/dto';
import { usersService } from '../users/service';
import { validationMiddleware } from '../middleware/validation';

export const authRouter = Router();

authRouter.post(
  '/register',
  validationMiddleware(CreateUserDto),
  async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserDto: CreateUserDto = req.body;
      const user = await usersService.createUser(createUserDto);
      res.json({ id: user.id });
    } catch (error) {
      next(error);
    }
  },
);
