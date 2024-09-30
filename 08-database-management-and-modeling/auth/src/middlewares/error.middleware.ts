import * as yup from 'yup';
import type { Request, Response, NextFunction } from 'express';

type CauseError = {
  statusCode?: number;
  stackTrace?: unknown;
};

/**
 * @description Handle all error inside the app
 *
 */
export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle validation error
  if (err instanceof yup.ValidationError) {
    const errors = err.inner.map((error) => ({
      message: error.message,
      field: error.path || '',
    }));

    res.status(422).json({
      message: 'Invalid data input',
      errors,
    });

    return;
  }

  // Handle cause / custom (status code) identifier error
  if (err instanceof Error) {
    const cause = err?.cause as CauseError;
    if (cause && cause?.statusCode) {
      res.status(cause.statusCode).json({
        message: err.message,
        stackTrace: cause?.stackTrace || err?.stack,
      });

      return;
    }
  }

  res.status(500).json({
    message: 'Something went wrong in the server',
    errors: [
      {
        message: err instanceof Error ? err.message : 'Internal Server Error',
      },
    ],
    stackTrace: err instanceof Error ? err?.stack : null,
  });
};
