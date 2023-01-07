import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      email VARCHAR(50) UNIQUE NOT NULL,
      username VARCHAR(25) UNIQUE NOT NULL,
      password VARCHAR(200) NOT NULL,
      created_on TIMESTAMP NOT NULL
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE users
  `);
}
