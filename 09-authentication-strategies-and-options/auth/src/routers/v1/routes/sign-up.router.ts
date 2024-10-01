import type { Request, Response } from 'express'
import { ValidationService } from '@/services/validation.service'
import { signUpSchema } from '@/schemas/sign-up.schema'
import { User } from '@/models/user.model'

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = await ValidationService.validateBodyRequest(
    req.body,
    signUpSchema
  )
  const _email = email.toLowerCase().trim()

  const existedUser = await User.findOne({ email: _email })
  if (existedUser)
    throw new Error('Email already been used', {
      cause: {
        statusCode: 400
      }
    })

  const newUser = User.build({ email: _email, password })
  const createdUser = await newUser.save()

  res.status(201).json({
    message: 'User successfully created',
    data: createdUser
  })
}
