import { Request, Response } from 'express';

import HttpError from './HttpError';

export async function errorHandler(
  error: HttpError | Error,
  req: Request,
  res: Response,
) {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;

  res.status(statusCode).json({ message: error.message });
}
