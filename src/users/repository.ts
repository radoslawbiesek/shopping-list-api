import { pool } from '../database/pool';

import { User } from './model';

export const usersRepository = {
  async findByEmail(email: string): Promise<User> {
    const response = await pool.query(`SELECT * FROM users WHERE email=$1;`, [
      email,
    ]);

    return response.rows[0];
  },
  async create(data: { email: string; password: string }): Promise<User> {
    const { email, password } = data;
    const response = await pool.query(
      `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`,
      [email, password],
    );

    return response.rows[0];
  },
};
