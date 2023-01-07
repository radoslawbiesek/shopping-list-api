import { Server } from 'http';
import { faker } from '@faker-js/faker';
import { AxiosInstance } from 'axios';

import { startServer } from '../server';
import { createAuthenticatedClient } from './utils/client';
import { mockCategory, mockUser } from './utils/mock';
import { User } from '../users/repository';

let server: Server;
let user: User;
let client: AxiosInstance;

beforeAll(async () => {
  server = await startServer();
  user = await mockUser();
  client = await createAuthenticatedClient(user);
});

afterAll(() => {
  server.close();
});

describe('[Categories] - /category', () => {
  const endpoint = '/category';
  describe('CRUD', () => {
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
