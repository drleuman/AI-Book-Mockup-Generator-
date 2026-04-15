
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/security';
import { logger } from '../utils/logger';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    logger.warn('Schema validation failed', {
      path: req.path,
      issues: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });

    return res.status(400).json({
      code: 'INVALID_OPTIONS',
      message: 'The request payload is invalid.',
    });
  }

  if (err instanceof ApiError) {
    logger.warn('Handled API error', {
      path: req.path,
      code: err.code,
      statusCode: err.statusCode,
    });

    return res.status(err.statusCode).json({
      code: err.code,
      message: err.expose ? err.message : 'Request failed.',
    });
  }

  logger.error('Unhandled server error', {
    path: req.path,
    error: err instanceof Error ? err.message : 'Unknown error',
  });

  return res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected server error occurred.',
  });
}
