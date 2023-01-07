import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto';
import { usersRepository, User } from './repository';
import { HttpError } from '../utils/errors';

async function getByEmail(email: string): Promise<User> {
  return usersRepository.findByEmail(email);
}

async function createUser(createUserDto: CreateUserDto): Promise<User> {
  const { password, email, username } = createUserDto;

  const existingUser = await usersRepository.findByEmailOrUsername({
    email,
    username,
  });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new HttpError(400, 'User with given email already exists');
    }

    throw new HttpError(400, 'User with given username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await usersRepository.create({
    email,
    username,
    password: hashedPassword,
  });

  return user;
}

export const usersService = {
  getByEmail,
  createUser,
};
