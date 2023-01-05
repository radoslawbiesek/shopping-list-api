import pg from 'pg';

import { config } from '../config';

export const pool = new pg.Pool({
  connectionString: config.pg.connectionString,
});
