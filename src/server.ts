import express from 'express';
import { Server } from 'http';

import { config } from './config';
import { errorMiddleware } from './middleware/error';
import { authenticate } from './auth/middleware';
import { authRouter } from './auth/controller';
import { categoriesRouter } from './categories/controller';

export function startServer(): Server {
  const app = express();

  app.use(express.json());

  // Unauthenticated routes
  app.use('/auth', authRouter);

  // Authenticated routes
  app.use(authenticate);
  app.use('/category', categoriesRouter);

  app.use(errorMiddleware);

  const server = app.listen(config.port, () => {
    if (config.env === 'development') {
      console.log(`Server is running at https://localhost:${config.port}`);
    }
  });

  return server;
}
