import { pool } from '../database/pool';
import { listsPermissionsRepository } from '../lists-permissions/repository';

import { GetAllResponse } from '../utils/types';

export type List = {
  list_id: number;
  name: string;
  created_by: number;
  created_on: Date;
};

export type ListPermission = {
  list_id: number;
  user_id: number;
  access: 'owner' | 'write' | 'read';
  created_on: Date;
  updated_on: Date;
};

export const listsRepository = { create, getAll };

async function create(userId: number, { name }: { name: string }): Promise<List> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN;');

    const result = await client.query(
      `
      INSERT INTO lists
        (created_by, name, created_on)
      VALUES
        ($1, $2, NOW())
      RETURNING
        *;
      `,
      [userId, name],
    );

    await listsPermissionsRepository.create(
      userId,
      { list_id: result.rows[0].list_id, access: 'owner' },
      client,
    );

    await client.query(`COMMIT;`);

    return result.rows[0];
  } catch (error) {
    await client.query(`ROLLBACK;`);
    throw error;
  } finally {
    client.release();
  }
}

async function getAll(userId: number): Promise<GetAllResponse<List>> {
  const result = await pool.query(
    `
    SELECT
      *
    FROM
      lists
    WHERE
      created_by = $1; 
  `,
    [userId],
  );

  return {
    results: result.rows as List[],
  };
}
