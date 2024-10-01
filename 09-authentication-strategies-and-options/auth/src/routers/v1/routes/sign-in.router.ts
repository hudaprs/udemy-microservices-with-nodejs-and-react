import type { Request, Response } from 'express'
import { ValidationService } from '@/services/validation.service'
import { signInSchema } from '@/schemas/sign-in.schema'
import { JwtService } from '@/services/jwt.service'
import { User } from '@/models/user.model'
import { SecurityService } from '@/services/security.service'

export const signIn = async (req: Request, res: Response) => {
  const body = await ValidationService.validateBodyRequest(
    req.body,
    signInSchema
  )
  const email = body.email.toLowerCase().trim()

  const user = await User.findOne({ email })
  if (!user)
    throw new Error('Invalid credentials', {
      cause: {
        statusCode: 400
      }
    })

  if (!SecurityService.compare(user.password, body.password)) {
    throw new Error('Invalid Credentials', {
      cause: {
        status: 400
      }
    })
  }

  const jwt = JwtService.generateToken({ id: user.id })

  req.session = {
    jwt
  }

  req.currentUser = { id: user.id }

  res.status(200).json({
    message: 'User successfully signed in',
    data: {
      token: jwt
    }
  })
}
