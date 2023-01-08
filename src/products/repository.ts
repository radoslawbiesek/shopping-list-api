import { pool } from '../database/pool';
import { DbErrorCode, isDbError, ValidationError } from '../utils/errors';

export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  category_id: number;
  created_by: number;
  created_on: Date;
};

async function createProduct({
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

async function getProductsBySearch(userId: number, search: string): Promise<Product[]> {
  const result = await pool.query(
    `
      SELECT 
        *
      FROM 
        products
      WHERE
        created_by = $1 AND CONCAT(name, decription) ILIKE '%$2%';
    `,
    [userId, search],
  );

  return result.rows;
}

async function getProductsByCategory(userId: number, categoryId: number): Promise<Product[]> {
  const result = await pool.query(
    `
      SELECT
        *
      FROM
        products
      WHERE
        created_by = $1 AND category_id = $2;
    `,
    [userId, categoryId],
  );

  return result.rows;
}

export const productsRepository = { createProduct, getProductsBySearch, getProductsByCategory };
