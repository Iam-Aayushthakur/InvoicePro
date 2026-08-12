import { AppError } from '../core/errors/index.js';
import { errorResponse } from '../core/responses/index.js';

/**
 * Global error handler that maps AppError subclasses to proper HTTP status codes.
 * Unknown errors are logged and returned as 500.
 */
export function handleError(error: unknown): Response {
  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode, error.code, error.details);
  }

  console.error('[Global Worker Error]:', error);
  const message = error instanceof Error ? error.message : 'Internal Server Error';
  return errorResponse(message, 500, 'SERVER_ERROR');
}
