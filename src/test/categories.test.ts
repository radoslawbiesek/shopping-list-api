import { Server } from 'http';
import { faker } from '@faker-js/faker';
import { AxiosInstance } from 'axios';

import { startServer } from '../server';
import { createAuthenticatedClient } from './utils/client';
import { clearMockedCategories, mockCategory, mockUser } from './utils/mock';
import { User } from '../users/repository';
import { Category } from '../categories/repository';

let server: Server;
let user: User;
let client: AxiosInstance;

beforeAll(async () => {
  server = await startServer();
  user = await mockUser();
  client = await createAuthenticatedClient(user);
});

beforeEach(async () => {
  await clearMockedCategories();
});

afterAll(async () => {
  await clearMockedCategories();
  server.close();
});

describe('[Categories] - /category', () => {
  const endpoint = '/category';
  describe('CRUD', () => {
    describe('Get all [GET /category]', () => {
      it('listing', async () => {
        const names = ['test1', 'test2', 'test3'];
        await Promise.all(names.map((name) => mockCategory(user.user_id, { name })));
        const response = await client.get(endpoint);
        expect(response.status).toBe(200);
        expect(response.data.length).toBe(3);
        expect(response.data.map((c: Category) => c.name)).toEqual(expect.arrayContaining(names));
      });

      it('listing only user categories', async () => {
        const names = ['test1', 'test2', 'test3'];
        await Promise.all(names.map((name) => mockCategory(user.user_id, { name })));

        const otherUser = await mockUser();
        const otherNames = ['test4', 'test5'];
        await Promise.all(otherNames.map((name) => mockCategory(otherUser.user_id, { name })));

        const response = await client.get(endpoint);
        expect(response.status).toBe(200);
        expect(response.data.length).toBe(3);
        expect(response.data.map((c: Category) => c.name)).toEqual(expect.arrayContaining(names));
      });
    });
    describe('Create [POST /category]', () => {
      describe('validation', () => {
        it.each([['name is required', {}, { name: ['name should not be empty'] }]])(
          '%s',
          async (_title, payload, errors) => {
            const error = await client.post(endpoint, payload).catch((e) => e.response);
            expect(error.status).toBe(400);
            expect(error.data.message).toBe('Invalid data');
            expect(error.data.details).toEqual(errors);
          },
        );

        it('name must be unique', async () => {
          const category = await mockCategory(user.user_id);
          const error = await client
            .post(endpoint, { name: category.name })
            .catch((e) => e.response);

          expect(error.status).toBe(400);
          expect(error.data.message).toBe('Invalid data');
          expect(error.data.details).toEqual({
            name: ['name must be unique'],
          });
        });
      });
      it('create category', async () => {
        const name = faker.datatype.string();
        const response = await client.post(endpoint, { name });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('category_id');
        expect(response.data.name).toBe(name);
        expect(response.data.parent_id).toBe(null);
        expect(response.data.created_by).toBe(user.user_id);
      });

      it('create sub category', async () => {
        const name = faker.datatype.string();
        const parent = await mockCategory(user.user_id);
        const response = await client.post(endpoint, {
          name,
          parent_id: parent.category_id,
        });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('category_id');
        expect(response.data.name).toBe(name);
        expect(response.data.parent_id).toBe(parent.category_id);
        expect(response.data.created_by).toBe(user.user_id);
      });
    });
  });
});
