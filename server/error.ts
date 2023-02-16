import { ValidationError } from "../lib/errors/ValidationError";

class ErrorWithCode extends Error {
  code: string | number;
}

interface ErrorResponseBody {
  message: string;
  errors?: object;
  /**
   * This refers to the Firebase error code, or any other unique error code
   * used by 3rd party services.
   */
  code?: string;
}

class FirebaseAuthError extends Error {
  code: string;
  message: string;
  stack?: string;
}

/**
 * FirebaseAuthError type guard
 */
const isFirebaseAuthError = (error: ErrorWithCode): error is FirebaseAuthError =>
  typeof error.code === 'string' && error.code.startsWith('auth/');

const isFirebaseStorageError = (error: ErrorWithCode) =>
  typeof error.code === 'number' && error.code === 10;

const isRedisError = (error: ErrorWithCode) =>
  typeof error.code === 'string' && error.code.startsWith('RedisError');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onError = (err: ErrorWithCode, req: any, res: any) => {
  let statusCode = err.code || 500;
  const jsonBody: ErrorResponseBody = { message: err.message };

  if (isFirebaseAuthError(err)) {
    statusCode = 401;
    jsonBody.code = err.code;
  } else if (isFirebaseStorageError(err)) {
    // 409 == Conflict
    statusCode = 409;
    jsonBody.message = 'Request failed, please try again';
  } else if (isRedisError(err)) {
    statusCode = 500;
    jsonBody.message = 'Request failed, please try again';
  }

  // Include validation errors in the response body
  if (err instanceof ValidationError) {
    jsonBody.errors = err.errors;
  }

  // Log server errors, except for validation errors
  if (!(err instanceof ValidationError)) console.error(err.message);

  statusCode = typeof statusCode !== 'number' ? 500
    : statusCode < 100 ? 500 : statusCode;

  if (statusCode === 500) {
    // Developer-facing errors:
    req.logger.error(err);
  } else {
    // This includes ForbiddenError and user-facing errors
    req.logger.info(`Error: ${err.message}`);
  }

  return res.status(statusCode).json(jsonBody);
};
