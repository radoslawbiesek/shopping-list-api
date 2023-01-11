import { pool } from '../database/pool';
import { DbErrorCode, isDbError, ValidationError } from '../utils/errors';

export type User = {
  user_id: number;
  username: string;
  email: string;
  password: string;
};

export const usersRepository = {
  getByEmail,
  create,
};

async function getByEmail(email: string): Promise<User> {
  const response = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

  return response.rows[0];
}

async function create({
  email,
  password,
  username,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<User> {
  try {
    const response = await pool.query(
      `INSERT INTO users (email, username, password, created_on) VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [email, username, password],
    );

    return response.rows[0];
  } catch (error: unknown) {
    if (isDbError(error) && error.code === DbErrorCode.UniqueViolation) {
      const details: Record<string, string[]> = {};
      if (error.constraint === 'users_username_key') {
        details.username = ['user with given username already exists'];
      }

      if (error.constraint === 'users_email_key') {
        details.email = ['user with given email already exists'];
      }

      throw new ValidationError(details);
    }

    throw error;
  }
}
