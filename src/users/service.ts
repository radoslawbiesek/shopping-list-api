import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto';
import { usersRepository, User } from './repository';
import { HttpError } from '../utils/errors';

async function getByEmail(email: string): Promise<User> {
  return usersRepository.findByEmail(email);
}

async function createUser(createUserDto: CreateUserDto): Promise<User> {
  const { password, email } = createUserDto;

  const existingUser = await getByEmail(email);
  if (existingUser) {
    throw new HttpError(400, 'User with given email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await usersRepository.create({
    email,
    password: hashedPassword,
  });

  return user;
}

export const usersService = {
  getByEmail,
  createUser,
};
