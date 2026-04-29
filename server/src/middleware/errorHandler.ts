/**
 * README: Error Handler Middleware
 * This middleware catches errors passed via next(err) and sends a standardized JSON response.
 * It handles Mongoose validation errors specifically with a 400 status.
 */

import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
  }

  const response: ErrorResponse = {
    success: false,
    message
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
