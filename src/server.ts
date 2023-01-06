import express, { Request, Response } from 'express';

import { authRouter } from './auth/controller';
import { authenticate } from './auth/middleware';
import { config } from './config';
import { errorMiddleware } from './middleware/error';

export function startServer() {
  const app = express();

  app.use(express.json());

  // Unauthenticated routes
  app.use('/auth', authRouter);

  // Authenticated routes
  app.use(authenticate);
  app.get('/', (req: Request, res: Response) => {
    res.json('authenticated');
  });

  app.use(errorMiddleware);

  app.listen(config.port, () => {
    console.log(`Server is running at https://localhost:${config.port}`);
  });
}
