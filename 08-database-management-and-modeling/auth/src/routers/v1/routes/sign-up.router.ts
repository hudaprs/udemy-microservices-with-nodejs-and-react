import type { Request, Response } from 'express'
import { ValidationService } from '@/services/validation.service'
import { signUpSchema } from '@/schemas/sign-up.schema'
import type { InferType } from 'yup'
import { User } from '@/models/user.model'

export const signUp = async (req: Request, res: Response) => {
  const validationService = new ValidationService(req.body)
  await validationService.validateBodyRequest(signUpSchema)

  const { email, password } = req.body as InferType<typeof signUpSchema>

  const existedUser = await User.findOne({ email: email.toLowerCase().trim() })
  if (existedUser)
    throw new Error('Email already been used', {
      cause: {
        statusCode: 400
      }
    })

  const newUser = User.build({ email, password })
  const createdUser = await newUser.save()

  res.status(201).json({
    message: 'User successfully created',
    data: createdUser
  })
}
