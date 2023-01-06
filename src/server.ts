import express from 'express';

import { authRouter } from './auth/router';
import { config } from './config';
import { errorHandler } from './utils/error-handler';

export function startServer() {
  const app = express();

  app.use(express.json());

  app.use('/auth', authRouter);

  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(`Server is running at https://localhost:${config.port}`);
  });
}
