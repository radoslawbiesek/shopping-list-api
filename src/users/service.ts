import * as bcrypt from 'bcrypt';

import HttpError from '../utils/HttpError';
import { CreateUserDto, User } from './model';
import { usersRepository } from './repository';

export const usersService = {
  async getByEmail(email: string): Promise<User> {
    return usersRepository.findByEmail(email);
  },
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;

    const existingUser = await this.getByEmail(email);

    if (existingUser) {
      throw new HttpError(400, 'User with given email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await usersRepository.create({
      email,
      password: hashedPassword,
    });

    return user;
  },
};
