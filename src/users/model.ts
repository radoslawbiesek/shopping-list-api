export type User = {
  id: number;
  email: string;
  password: string;
};

export type CreateUserDto = {
  email: string;
  password: string;
};
