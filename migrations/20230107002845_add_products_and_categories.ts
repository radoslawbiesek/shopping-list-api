import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE categories (
      category_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(25) NOT NULL,
      parent_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
      created_by INTEGER REFERENCES users(user_id) ON DELETE CASCADE, 
      created_on TIMESTAMP NOT NULL,
      UNIQUE(name, created_by)
    );

    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(25) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      category_id INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
      created_by INTEGER REFERENCES users(user_id) ON DELETE CASCADE, 
      created_on TIMESTAMP NOT NULL,
      last_used TIMESTAMP,
      UNIQUE(name, created_by)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE products;
    DROP TABLE categories;
  `);
}
