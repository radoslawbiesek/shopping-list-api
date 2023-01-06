import { NextFunction, Request, Response } from 'express';
import { usersService } from '../users/service';

export const authController = {
  async login(req: Request, res: Response) {
    res.send('to do');
  },
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await usersService.createUser({ email, password });

      res.json({ id: user.id });
    } catch (error) {
      next(error);
    }
  },
};
