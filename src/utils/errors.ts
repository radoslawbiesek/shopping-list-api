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
