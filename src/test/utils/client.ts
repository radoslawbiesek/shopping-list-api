import axios, { AxiosInstance } from 'axios';

import { config } from '../../config';
import { User } from '../../users/repository';
import { authService } from '../../auth/service';

const baseURL = `http://localhost:${config.port}`;

export const client: AxiosInstance = axios.create({
  baseURL,
});

export async function createAuthenticatedClient(user: User): Promise<AxiosInstance> {
  const { token } = await authService.createToken(user);

  return axios.create({
    baseURL,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
}
