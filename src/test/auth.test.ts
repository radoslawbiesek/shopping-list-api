import { Server } from 'http';
import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { startServer } from '../server';
import { client } from './utils/client';
import { mockUser } from './utils/mock';

let server: Server;

beforeAll(async () => {
  server = await startServer();
});

afterAll(() => {
  server.close();
});

describe('[Auth] - /auth', () => {
  describe('Auth Flow', () => {
    it('register, login and receiving token', async () => {
      const data = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
      };

      // Register
      const registerResult = await client.post('/auth/register', data);
      expect(registerResult.status).toBe(200);
      expect(registerResult.data).toHaveProperty('id');
      expect(registerResult.data).not.toHaveProperty('password');

      // Login with invalid password
      const loginError = await client
        .post('/auth/login', {
          ...data,
          password: 'invalid_password',
        })
        .catch((e) => e.response);
      expect(loginError.status).toBe(400);
      expect(loginError.data.message).toBe(
        'No active account found with the given credentials.',
      );

      // Login
      const loginResult = await client.post('/auth/login', {
        password: data.password,
        email: data.email,
      });
      expect(loginResult.status).toBe(200);
      expect(loginResult.data).toHaveProperty('token');
      expect(loginResult.data).toHaveProperty('expiresIn');
      expect(loginResult.data).not.toHaveProperty('password');
    });
  });

  describe('Register [POST /auth/register]', () => {
    describe('validation', () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const username = faker.internet.userName();
      const data = {
        email,
        username,
        password,
      };
      const longEmail = 'a'.repeat(42) + '@test.com';
      const shortPassword = faker.internet.password(7);
      const longPassword = faker.internet.password(17);
      const shortUsername = 'a'.repeat(3);
      const longUsername = 'a'.repeat(26);

      it.each([
        [
          'password is required',
          { ..._.omit(data, 'password') },
          { password: ['password should not be empty'] },
        ],
        [
          'password must not be too short',
          { ...data, password: shortPassword },
          {
            password: ['password must be longer than or equal to 8 characters'],
          },
        ],
        [
          'password must not be too long',
          { ...data, password: longPassword },
          {
            password: [
              'password must be shorter than or equal to 16 characters',
            ],
          },
        ],
        [
          'email is required',
          { ..._.omit(data, 'email') },
          { email: ['email should not be empty'] },
        ],
        [
          'email must be valid',
          { ...data, email: 'invalid_email' },
          { email: ['email must be an email'] },
        ],
        [
          'email must not be too long',
          { ...data, email: longEmail },
          { email: ['email must be shorter than or equal to 50 characters'] },
        ],
        [
          'username is required',
          { ..._.omit(data, 'username') },
          { username: ['username should not be empty'] },
        ],
        [
          'username must not be too short',
          { ...data, username: shortUsername },
          {
            username: ['username must be longer than or equal to 4 characters'],
          },
        ],
        [
          'username must not be too long',
          { ...data, username: longUsername },
          {
            username: [
              'username must be shorter than or equal to 25 characters',
            ],
          },
        ],
      ])('%s', async (_title, payload, errors) => {
        const error = await client
          .post('/auth/register', payload)
          .catch((e) => e.response);
        expect(error.status).toBe(400);
        expect(error.data.message).toBe('Invalid data');
        expect(error.data.details).toEqual(errors);
      });

      it('email must be unique', async () => {
        const user = await mockUser();
        const error = await client
          .post('/auth/register', { ...data, email: user.email })
          .catch((e) => e.response);
        expect(error.status).toBe(400);
        expect(error.data.message).toBe('User with given email already exists');
      });

      it('username must be unique', async () => {
        const user = await mockUser();
        const error = await client
          .post('/auth/register', { ...data, username: user.username })
          .catch((e) => e.response);
        expect(error.status).toBe(400);
        expect(error.data.message).toBe(
          'User with given username already exists',
        );
      });
    });
  });

  describe('Login [POST /auth/login]', () => {
    describe('validation', () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      it.each([
        [
          'password is required',
          { email },
          { password: ['password should not be empty'] },
        ],
        [
          'email is required',
          { password },
          { email: ['email should not be empty'] },
        ],
      ])('%s', async (_title, payload, errors) => {
        const error = await client
          .post('/auth/login', payload)
          .catch((e) => e.response);
        expect(error.status).toBe(400);
        expect(error.data.message).toBe('Invalid data');
        expect(error.data.details).toEqual(errors);
      });

      it('user must exist', async () => {
        const error = await client
          .post('/auth/login', {
            email: 'not_existing_user@test.com',
            password,
          })
          .catch((e) => e.response);
        expect(error.status).toBe(400);
        expect(error.data.message).toBe(
          'No active account found with the given credentials.',
        );
      });
    });
  });
});
