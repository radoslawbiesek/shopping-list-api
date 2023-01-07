import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto';
import { usersRepository, User } from './repository';

async function getByEmail(email: string): Promise<User> {
  return usersRepository.findByEmail(email);
}

async function createUser(createUserDto: CreateUserDto): Promise<User> {
  const { password, email, username } = createUserDto;

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
