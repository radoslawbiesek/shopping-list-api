import { pool } from '../database/pool';

export type User = {
  user_id: number;
  username: string;
  email: string;
  password: string;
};

async function findByEmail(email: string): Promise<User> {
  const response = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  return response.rows[0];
}

async function findByEmailOrUsername({
  username,
  email,
}: {
  username: string;
  email: string;
}): Promise<User> {
  const response = await pool.query(
    `SELECT * FROM users WHERE username=$1 OR email=$2`,
    [username, email],
  );

  return response.rows[0];
}

async function create(data: {
  email: string;
  password: string;
  username: string;
}): Promise<User> {
  const { email, password, username } = data;
  const response = await pool.query(
    `INSERT INTO users (email, username, password, created_on) VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [email, username, password],
  );

  return response.rows[0];
}

export const usersRepository = {
  findByEmail,
  findByEmailOrUsername,
  create,
};
