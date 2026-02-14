import { Request, Response, NextFunction } from 'express';
import { log } from '@/config/logger';
import { AppError } from '@/utils/errors';
import { ApiError } from 'shared/types';

export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  log.error('Error:', error);

  if (error instanceof AppError) {
    const response: ApiError = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
    res.status(error.statusCode).json(response);
    return;
  }

  // Generic error
  const response: ApiError = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  };
  res.status(500).json(response);
};
