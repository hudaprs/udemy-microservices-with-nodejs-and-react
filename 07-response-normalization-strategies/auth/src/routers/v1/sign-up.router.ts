import type { Request, Response } from 'express';
import { ValidationService } from '@/services/validation.service';
import { signUpSchema } from '@/schemas/sign-up.schema';

export const signUp = async (req: Request, res: Response) => {
  const validationService = new ValidationService(req.body);

  await validationService.validateBodyRequest(signUpSchema);

  res.status(201).json({ message: 'OK' });
};
