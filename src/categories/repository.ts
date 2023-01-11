import { pool } from '../database/pool';
import { ValidationError, DbErrorCode, isDbError } from '../utils/errors';
import { GetAllResponse } from '../utils/types';

export type Category = {
  category_id: number;
  name: string;
  parent_id: number | null;
  created_by: number;
  created_on: Date;
};

export const categoriesRepository = {
  getAll,
  create,
};

async function getAll(userId: number): Promise<GetAllResponse<Category>> {
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

  return {
    results: result.rows,
  };
}

async function _create({ name, created_by }: { name: string; created_by: number }) {
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

async function create({
  name,
  parent_id,
  created_by,
}: {
  name: string;
  created_by: number;
  parent_id: number | null;
}) {
  try {
    const result =
      parent_id !== null
        ? await _createSubCategory({ name, parent_id, created_by })
        : await _create({ name, created_by });

    return result.rows[0];
  } catch (error: unknown) {
    if (isDbError(error)) {
      if (error.code === DbErrorCode.UniqueViolation) {
        throw new ValidationError({
          name: ['name must be unique'],
        });
      } else if (error.code === DbErrorCode.ForeignKeyViolation) {
        throw new ValidationError({
          parent_id: ['category with given id does not exist'],
        });
      }
    }

    throw error;
  }
}
