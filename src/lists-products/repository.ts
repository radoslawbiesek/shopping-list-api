import { pool } from '../database/pool';
import { Product, productsRepository } from '../products/repository';
import { DbErrorCode, isDbError, NotFoundError, ValidationError } from '../utils/errors';

import { CreateListProductDto } from './dto';

export type ListProduct = {
  list_product_id: number;
  list_id: number;
  product_id: number;
  amount: number;
  is_checked: boolean;
  is_high_priority: boolean;
  created_by: number;
  created_on: Date;
  updated_on: Date;
};

export const listsProductsRepository = { create, getAll };

async function create(
  userId: number,
  listId: number,
  { product_id }: CreateListProductDto,
): Promise<ListProduct> {
  const client = await pool.connect();
  try {
    await client.query(`BEGIN;`);
    const result = await client.query(
      `
      INSERT INTO lists_products
        (created_by, list_id, product_id, created_on)
      VALUES
        ($1, $2, $3, NOW())
      RETURNING
        *;
      `,
      [userId, listId, product_id],
    );

    await productsRepository._updateLastUsed(userId, product_id, client);

    await client.query(`COMMIT;`);

    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK;');

    if (isDbError(error) && error.code === DbErrorCode.ForeignKeyViolation) {
      if (error.constraint === 'lists_products_product_id_fkey') {
        throw new ValidationError({ product_id: ['product with given id does not exist'] });
      }

      if (error.constraint === 'lists_products_list_id_fkey') {
        throw new NotFoundError();
      }
    }

    throw error;
  } finally {
    client.release();
  }
}

async function getAll(
  userId: number,
  listId: number,
): Promise<Array<ListProduct & Pick<Product, 'name' | 'description' | 'image' | 'category_id'>>> {
  const result = await pool.query(
    `
    SELECT
      lp.list_product_id,
      lp.list_id,
      lp.product_id,
      lp.is_checked,
      lp.is_high_priority,
      lp.created_by,
      lp.created_on,
      lp.updated_on,
      p.name,
      p.description,
      p.image,
      p.category_id
    FROM
      lists_products lp
    INNER JOIN
      products p
    ON
      lp.product_id = p.product_id
    WHERE
      lp.created_by = $1 AND lp.list_id = $2;
  `,
    [userId, listId],
  );

  return result.rows;
}
