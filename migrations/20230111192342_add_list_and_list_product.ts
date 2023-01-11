import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE lists (
      list_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(25) NOT NULL,
      created_by INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      created_on TIMESTAMP NOT NULL,
      updated_on TIMESTAMP
    );

    CREATE TABLE lists_permissions (
      CONSTRAINT list_permission_pk PRIMARY KEY (list_id, user_id),
      list_id INTEGER REFERENCES lists(list_id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      created_on TIMESTAMP NOT NULL,
      access VARCHAR(5),
      CONSTRAINT access CHECK (access IN ('owner', 'write', 'read')),
      updated_on TIMESTAMP
    );

    CREATE TABLE lists_products (
      list_product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      list_id INTEGER REFERENCES lists(list_id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
      is_checked BOOLEAN DEFAULT false,
      is_high_priority BOOLEAN DEFAULT false,
      created_by INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      created_on TIMESTAMP NOT NULL,
      updated_on TIMESTAMP
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE lists_products;
    DROP TABLE lists_permissions;
    DROP TABLE lists;
  `);
}
