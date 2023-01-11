import { faker } from '@faker-js/faker';

import { User, usersRepository } from '../../users/repository';
import { CreateCategoryDto } from '../../categories/dto';
import { categoriesRepository, Category } from '../../categories/repository';
import { CreateUserDto } from '../../users/dto';
import { pool } from '../../database/pool';
import { CreateProductDto } from '../../products/dto';
import { productsRepository } from '../../products/repository';

export function mockUser(overrides: Partial<CreateUserDto> = {}): Promise<User> {
  const userData = {
    email: faker.internet.email(),
    password: faker.internet.password(8),
    username: faker.internet.userName(),
    ...overrides,
  };

  return usersRepository.create(userData);
}

export function mockCategory(
  userId: number,
  overrides: Partial<CreateCategoryDto> = {},
): Promise<Category> {
  const categoryData = {
    created_by: userId,
    name: faker.datatype.string(),
    parent_id: null,
    ...overrides,
  };

  return categoriesRepository.create(categoryData);
}

export async function mockProduct(userId: number, overrides: Partial<CreateProductDto> = {}) {
  const category = await mockCategory(userId);
  const productData = {
    created_by: userId,
    name: faker.datatype.string(),
    description: faker.datatype.string(),
    image: faker.internet.url(),
    category_id: category.category_id,
    ...overrides,
  };

  return productsRepository.create(productData);
}

export async function clearMockedCategories() {
  await pool.query(`DELETE FROM categories`);
}

export async function clearMockedProducts() {
  await pool.query(`DELETE FROM products`);
}
