import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  pg: {
    connectionString: process.env.PG_CONNECTION_STRING,
  },
} as const;
