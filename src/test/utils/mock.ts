import { faker } from '@faker-js/faker';

import { CreateUserDto } from '../../users/dto';
import { User, usersRepository } from '../../users/repository';

export function mockUser(
  overrides: Partial<CreateUserDto> = {},
): Promise<User> {
  const createUserDto = {
    email: faker.internet.email(),
    password: faker.internet.password(8),
    ...overrides,
  };

  return usersRepository.create(createUserDto);
}
