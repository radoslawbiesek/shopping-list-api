import { pool } from '../database/pool';
import { ValidationError, DbErrorCode, isDbError } from '../utils/errors';

export type Category = {
  category_id: number;
  name: string;
  parent_id: number | null;
  created_by: number;
  created_on: Date;
};

async function getAllCategories(userId: number): Promise<Category[]> {
  const result = await pool.query(
    `
      SELECT
        *
      FROM
        categories
      WHERE
        created_by = $1
    `,
    [userId],
  );

  return result.rows;
}

async function _createCategory({ name, created_by }: { name: string; created_by: number }) {
  return pool.query(
    `
      INSERT INTO categories
        (created_on, name, created_by)
      VALUES
        (NOW(), $1, $2)
      RETURNING 
        *
    `,
    [name, created_by],
  );
}

async function _createSubCategory({
  name,
  parent_id,
  created_by,
}: {
  name: string;
  created_by: number;
  parent_id: number;
}) {
  return pool.query(
    `
      INSERT INTO categories
        (created_on, name, created_by, parent_id)
      VALUES
        (NOW(), $1, $2, $3)
      RETURNING 
        *
    `,
    [name, created_by, parent_id],
  );
}

async function createCategory({
  name,
  parent_id,
  created_by,
}: {
  name: string;
  created_by: number;
  parent_id: number | null;
}) {
  try {
    const response =
      parent_id !== null
        ? await _createSubCategory({ name, parent_id, created_by })
        : await _createCategory({ name, created_by });

    return response.rows[0];
  } catch (error: unknown) {
    if (isDbError(error) && error.code === DbErrorCode.UniqueViolation) {
      throw new ValidationError({
        name: ['name must be unique'],
      });
    }

    throw error;
  }
}

export const categoriesRepository = {
  getAllCategories,
  createCategory,
};
