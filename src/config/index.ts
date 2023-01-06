import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  pg: {
    connectionString: process.env.PG_CONNECTION_STRING,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
} as const;
