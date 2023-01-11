import { Request } from 'express';

export type RequestWithUser = Request & { userId: number };

type JSONPrimitive = string | number | boolean | null;
type JSONObject = { [k: string]: JSONValue };
type JSONArray = JSONValue[];
export type JSONValue = JSONArray | JSONObject | JSONPrimitive;

export type GetAllResponse<T> = {
  results: T[];
  total?: number;
  limit?: number;
  offset?: number;
};
