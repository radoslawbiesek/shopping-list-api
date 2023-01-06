import * as dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  pg: {
    connectionString: process.env.PG_CONNECTION_STRING,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
} as const;
