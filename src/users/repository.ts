import { pool } from '../database/pool';

export type User = {
  id: number;
  email: string;
  password: string;
};

async function findByEmail(email: string): Promise<User> {
  const response = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  return response.rows[0];
}

async function create(data: {
  email: string;
  password: string;
}): Promise<User> {
  const { email, password } = data;
  const response = await pool.query(
    `INSERT INTO users (email, password, created_on) VALUES ($1, $2, NOW()) RETURNING *`,
    [email, password],
  );

  return response.rows[0];
}

export const usersRepository = {
  findByEmail,
  create,
};
