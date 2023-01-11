import { JSONValue } from './types';

export class HttpError extends Error {
  public statusCode: number;
  public message: string;
  public details?: JSONValue;

  constructor(statusCode: number, message: string, details?: JSONValue) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, details: JSONValue) {
    super(400, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(404, message);
  }
}

export class ValidationError extends BadRequestError {
  constructor(details: Record<string, string[]>) {
    super('Invalid data', details);
  }
}

export function isDbError(value: unknown): value is Record<string, string> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

export const DbErrorCode = {
  UniqueViolation: '23505',
  ForeignKeyViolation: '23503',
};
