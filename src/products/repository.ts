import { PoolClient } from 'pg';
import { pool } from '../database/pool';
import { DbErrorCode, isDbError, ValidationError } from '../utils/errors';
import { GetAllResponse } from '../utils/types';
import { GetAllProductsQuery } from './dto';

export type Product = {
  product_id: number;
  name: string;
  description: string;
  image: string;
  category_id: number;
  created_by: number;
  created_on: Date;
};

export const productsRepository = { create, getAll, _updateLastUsed };

async function create({
  created_by,
  name,
  description,
  image,
  category_id,
}: {
  created_by: number;
  name: string;
  description: string;
  image: string | null;
  category_id: number;
}): Promise<Product> {
  try {
    const result = await pool.query(
      `
        INSERT INTO products
          (created_on, created_by, name, description, image, category_id)
        VALUES
          (NOW(), $1, $2, $3, $4, $5)
        RETURNING *;
      `,
      [created_by, name, description, image, category_id],
    );
    return result.rows[0];
  } catch (error: unknown) {
    if (isDbError(error)) {
      if (error.code === DbErrorCode.UniqueViolation) {
        throw new ValidationError({
          name: ['name must be unique'],
        });
      } else if (error.code === DbErrorCode.ForeignKeyViolation) {
        throw new ValidationError({
          category_id: ['category with given id does not exist'],
        });
      }
    }

    throw error;
  }
}

async function getAll(
  userId: number,
  params: GetAllProductsQuery,
): Promise<GetAllResponse<Product>> {
  const [query, values] = _createGetProductsQuery(userId, params);
  const result = await pool.query(query, values);

  return {
    results: result.rows as Product[],
  };
}

async function _updateLastUsed(userId: number, productId: number, client: PoolClient) {
  return client.query(
    `
    UPDATE
      products
    SET
      last_used = NOW()
    WHERE
      created_by = $1 AND product_id = $2;
  `,
    [userId, productId],
  );
}

export function _createGetProductsQuery(
  userId: number,
  params: GetAllProductsQuery,
): [string, Array<string | number>] {
  let query = `SELECT * FROM products WHERE created_by = $1`;
  const values: Array<string | number> = [userId];

  if (params.search) {
    values.push(`%${params.search}%`);
    query += ` AND CONCAT(name, description) ILIKE $${values.length}`;
  }

  if (params.category_id) {
    values.push(params.category_id);
    query += ` AND category_id = $${values.length}`;
  }

  if (params.order_by) {
    if (params.order_by.startsWith('-')) {
      values.push(`${params.order_by.substring(1)} DESC`);
    } else {
      values.push(`${params.order_by} ASC`);
    }
    query += ` ORDER BY $${values.length}`;
  }

  if (params.limit) {
    values.push(params.limit);
    query += ` LIMIT $${values.length}`;
  }

  if (params.offset) {
    values.push(params.offset);
    query += ` OFFSET $${values.length}`;
  }

  return [query, values];
}
