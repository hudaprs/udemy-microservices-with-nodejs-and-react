import * as yup from 'yup'
import type { NextFunction, Request, Response } from 'express'
import { JwtService } from './jwt.service'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { User } from '@/models/user.model'

type CauseError = {
  statusCode?: number
  stackTrace?: unknown
}

export class ValidationService {
  /**
   * @description Handle all error inside the app
   *
   * @param err Plain error
   * @param req Express request
   * @param res Express response
   * @param next Express next function
   */
  public static handleError(
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line
    next: NextFunction
  ) {
    // Handle validation error
    if (err instanceof yup.ValidationError) {
      const errors = err.inner.map(error => ({
        message: error.message,
        field: error.path || ''
      }))

      res.status(422).json({
        message: 'Invalid data input',
        errors
      })

      return
    }

    // Handle cause / custom (status code) identifier error
    if (err instanceof Error) {
      const cause = err?.cause as CauseError
      if (cause && cause?.statusCode) {
        res.status(cause.statusCode).json({
          message: err.message,
          stackTrace: cause?.stackTrace || err?.stack
        })

        return
      }
    }

    res.status(500).json({
      message: 'Something went wrong in the server',
      errors: [
        {
          message: err instanceof Error ? err.message : 'Internal Server Error'
        }
      ],
      stackTrace: err instanceof Error ? err?.stack : null
    })
  }

  /**
   * @description Validate incoming request if no request body passed
   * @param body body of request
   * @param schema yup schema validator
   * @returns A promise that resolves if validation passes
   */
  public static async validateBodyRequest<T = unknown>(
    body: unknown,
    schema: yup.Schema<T>
  ): Promise<T> {
    await schema.validate(body, { abortEarly: false })

    return body as T
  }

  /**
   * @description Require authentication
   * @param req Express request
   * @param res Express response
   * @param next Express next function
   */
  public static async requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.session?.jwt) {
      throw new Error('Unauthorized', {
        cause: {
          statusCode: 401
        }
      })
    }

    try {
      const user = JwtService.verify(req.session.jwt)

      if (user?.id) {
        const existedUser = await User.findById(user.id)
        if (!existedUser)
          throw new Error('Unauthorized, user not found', {
            cause: {
              statusCode: 401
            }
          })
        req.currentUser = user
      }
    } catch (err) {
      // Handle JWT Error Expired
      if (err instanceof TokenExpiredError) {
        res.status(401).json({
          message: 'Authentication Error',
          errors: [{ message: err.message }]
        })
        return
      }

      // Handle JWT Common Error
      if (err instanceof JsonWebTokenError) {
        res.status(401).json({
          message: 'Authentication Error',
          errors: [{ message: err.message }]
        })
        return
      }

      res.status(500).json({
        message: 'Authentication Error',
        errors: [
          {
            message:
              err instanceof Error
                ? err.message
                : 'Something went inside verifying authenticated user'
          }
        ]
      })
    }

    next()
  }
}
