import { Router, NextFunction, Request, Response } from 'express';

import { CreateUserDto } from '../users/dto';
import { validationMiddleware } from '../middleware/validation';
import { LoginDto } from './dto';
import { usersService } from '../users/service';
import { authService } from './service';

export const authRouter = Router();

authRouter.post(
  '/register',
  validationMiddleware(CreateUserDto),
  async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserDto: CreateUserDto = req.body;
      const user = await usersService.createUser(createUserDto);
      res.json({ id: user.user_id });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  '/login',
  validationMiddleware(LoginDto),
  async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginDto: LoginDto = req.body;
      const user = await authService.validatePassword(loginDto);
      const { token, expiresIn } = await authService.createToken(user);

      res.json({ token, expiresIn });
    } catch (error) {
      next(error);
    }
  },
);
