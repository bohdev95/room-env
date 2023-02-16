import { HttpError } from "./HttpError";

export class ValidationError extends HttpError {
  errors: object;

  constructor(message = 'Validation Error', errors = {}) {
    super(400, message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
