import express from 'express';

import { authRouter } from './auth/controller';
import { config } from './config';
import { errorMiddleware } from './middleware/error';

export function startServer() {
  const app = express();

  app.use(express.json());

  app.use('/auth', authRouter);

  app.use(errorMiddleware);

  app.listen(config.port, () => {
    console.log(`Server is running at https://localhost:${config.port}`);
  });
}
