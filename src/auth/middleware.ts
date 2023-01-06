import { NextFunction, Response, Request } from 'express';
import { HttpError } from '../utils/errors';
import { RequestWithUser } from '../utils/types';
import { authService } from './service';

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const requestWithUser = req as RequestWithUser;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split('Bearer ')[1];
    const decodedToken = token && (await authService.validateToken(token));

    if (!decodedToken) {
      next(new HttpError(401, 'Not authenticated'));
      return;
    }

    requestWithUser.userId = decodedToken.userId;
    next();
  } catch (err) {
    next(new HttpError(401, 'Not authenticated'));
  }
}

export { authenticate };
