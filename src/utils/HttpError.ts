class HttpError extends Error {
  constructor(public statusCode: number, message?: string) {
    super(message);
  }
}

export default HttpError;
