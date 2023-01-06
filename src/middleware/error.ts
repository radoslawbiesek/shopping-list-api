/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../utils/errors';

export async function errorMiddleware(
  error: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
    return;
  }

  res.status(500).json({ message: error.message });
}
