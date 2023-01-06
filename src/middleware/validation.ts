import { NextFunction, Request, RequestHandler, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

import { HttpError } from '../utils/errors';

export function validationMiddleware(type: { new (): object }): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    const errors = await validate(plainToInstance(type, req.body), {
      whitelist: true,
      stopAtFirstError: true,
    });
    if (errors.length > 0) {
      const details = errors.reduce(
        (acc: Record<string, string[]>, error: ValidationError) => {
          const { property, constraints } = error;
          if (property && constraints) {
            acc[property] = Object.values(constraints);
          }

          return acc;
        },
        {},
      );

      next(new HttpError(400, 'Invalid data', details));
    } else {
      next();
    }
  };
}
