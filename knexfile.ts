import type { Knex } from 'knex';

import { config } from './src/config';

export const knexConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    connectionString: config.pg.connectionString,
  },
};

module.exports = knexConfig;
