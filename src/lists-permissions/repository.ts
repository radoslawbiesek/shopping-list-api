import { Pool, PoolClient } from 'pg';
import { pool } from '../database/pool';

export type ListPermission = {
  list_id: number;
  user_id: number;
  access: 'owner' | 'write' | 'read';
  created_on: Date;
  updated_on: Date;
};

export const listsPermissionsRepository = { create };

async function create(
  userId: number,
  { list_id, access }: { list_id: number; access: ListPermission['access'] },
  client: PoolClient | Pool = pool,
) {
  await client.query(
    `
      INSERT INTO lists_permissions
        (user_id, list_id, created_on, access)
      VALUES
        ($1, $2, NOW(), $3);
      `,
    [userId, list_id, access],
  );
}
