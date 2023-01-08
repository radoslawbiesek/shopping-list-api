import { Server } from 'http';
import { faker } from '@faker-js/faker';
import { AxiosInstance } from 'axios';

import { startServer } from '../server';
import { createAuthenticatedClient } from './utils/client';
import { clearMockedProducts, mockCategory, mockProduct, mockUser } from './utils/mock';
import { User } from '../users/repository';
import { Category } from '../categories/repository';

let server: Server;
let user: User;
let client: AxiosInstance;
let category: Category;

beforeAll(async () => {
  server = await startServer();
  user = await mockUser();
  client = await createAuthenticatedClient(user);
  category = await mockCategory(user.user_id);
});

beforeEach(async () => {
  await clearMockedProducts();
});

afterAll(async () => {
  await clearMockedProducts();
  server.close();
});

describe('[Products] - /product', () => {
  const endpoint = '/product';
  describe('Create [POST /product]', () => {
    describe('validation', () => {
      it.each([
        [
          'category_id is required',
          { name: faker.datatype.string() },
          { category_id: ['category_id should not be empty'] },
        ],
      ])('%s', async (_title, payload, errors) => {
        const error = await client.post(endpoint, payload).catch((e) => e.response);
        expect(error.status).toBe(400);
        expect(error.data.message).toBe('Invalid data');
        expect(error.data.details).toEqual(errors);
      });

      it('name is required', async () => {
        const error = await client
          .post(endpoint, { category_id: category.category_id })
          .catch((e) => e.response);

        expect(error.status).toBe(400);
        expect(error.data.message).toBe('Invalid data');
        expect(error.data.details).toEqual({ name: ['name should not be empty'] });
      });

      it('name must be unique', async () => {
        const product = await mockProduct(user.user_id);
        const error = await client
          .post(endpoint, { name: product.name, category_id: category.category_id })
          .catch((e) => e.response);

        expect(error.status).toBe(400);
        expect(error.data.message).toBe('Invalid data');
        expect(error.data.details).toEqual({
          name: ['name must be unique'],
        });
      });

      it('image must be a valid url', async () => {
        const error = await client
          .post(endpoint, {
            name: faker.datatype.string(),
            category_id: category.category_id,
            image: faker.datatype.string(),
          })
          .catch((e) => e.response);

        expect(error.status).toBe(400);
        expect(error.data.message).toBe('Invalid data');
        expect(error.data.details).toEqual({
          image: ['image must be a URL address'],
        });
      });
    });
  });
});
