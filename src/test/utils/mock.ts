import { faker } from '@faker-js/faker';

import { User, usersRepository } from '../../users/repository';
import { CreateCategoryDto } from '../../categories/dto';
import { categoriesRepository, Category } from '../../categories/repository';
import { CreateUserDto } from '../../users/dto';

export function mockUser(
  overrides: Partial<CreateUserDto> = {},
): Promise<User> {
  const createUserDto = {
    email: faker.internet.email(),
    password: faker.internet.password(8),
    username: faker.internet.userName(),
    ...overrides,
  };

  return usersRepository.create(createUserDto);
}

export function mockCategory(
  userId: number,
  overrides: Partial<CreateCategoryDto> = {},
): Promise<Category> {
  const createCategoryDto = {
    created_by: userId,
    name: faker.datatype.string(),
    parent_id: null,
    ...overrides,
  };

  return categoriesRepository.createCategory(createCategoryDto);
}
