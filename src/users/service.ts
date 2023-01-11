import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto';
import { usersRepository, User } from './repository';

export const usersService = {
  getByEmail,
  create,
};

async function getByEmail(email: string): Promise<User> {
  return usersRepository.getByEmail(email);
}

async function create(createUserDto: CreateUserDto): Promise<User> {
  const { password, email, username } = createUserDto;

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await usersRepository.create({
    email,
    username,
    password: hashedPassword,
  });

  return user;
}
