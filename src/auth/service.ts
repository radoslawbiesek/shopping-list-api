import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { config } from '../config';
import { User } from '../users/repository';
import { usersService } from '../users/service';
import { HttpError } from '../utils/errors';
import { LoginDto } from './dto';

type TokenPayload = {
  userId: number;
  email: string;
};

async function validatePassword(loginDto: LoginDto): Promise<User> {
  const { email, password } = loginDto;

  const user = await usersService.getByEmail(email);
  const isValid = user && (await bcrypt.compare(password, user.password));

  if (!isValid) {
    throw new HttpError(400, 'No active account found with the given credentials.');
  }

  return user;
}

async function validateToken(token: string): Promise<TokenPayload> {
  const decodedToken = jwt.verify(token, config.jwt.secret);

  return decodedToken as TokenPayload;
}

async function createToken(user: User) {
  const payload: TokenPayload = { email: user.email, userId: user.user_id };
  const expiresIn = config.jwt.expiresIn;
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn,
  });

  return { token, expiresIn };
}

export const authService = {
  validatePassword,
  validateToken,
  createToken,
};
