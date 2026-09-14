/**
 * src/utils/ApiError.ts
 *
 * A custom error class that carries an HTTP status code alongside the message.
 * Throw this anywhere in your controllers/services and the global error handler
 * (middleware/errorHandler.ts) will format it correctly for the client.
 *
 * Usage:
 *   throw new ApiError(404, "Customer not found");
 *   throw new ApiError(400, "Phone number is required");
 *   throw new ApiError(409, "Appointment already exists");
 */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean; // true = expected/safe to expose to client

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Captures the correct stack trace in V8 engines (Node.js)
    Error.captureStackTrace(this, this.constructor);

    // Restore prototype chain (required when extending built-in classes in TS)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
