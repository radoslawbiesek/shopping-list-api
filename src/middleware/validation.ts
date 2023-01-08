import { NextFunction, Request, RequestHandler, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationError } from '../utils/errors';

export function validationMiddleware(
  type: { new (): object },
  field: 'body' | 'query' = 'body',
): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    const errors = await validate(plainToInstance(type, req[field]), {
      whitelist: true,
      stopAtFirstError: true,
    });
    if (errors.length > 0) {
      const details = errors.reduce((acc: Record<string, string[]>, error) => {
        const { property, constraints } = error;
        if (property && constraints) {
          acc[property] = Object.values(constraints);
        }

        return acc;
      }, {});

      next(new ValidationError(details));
    } else {
      next();
    }
  };
}
