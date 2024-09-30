import type { Request, Response } from 'express';
import { ValidationService } from '@/services/validation.service';
import { signInSchema } from '@/schemas/sign-in.schema';

export const signIn = async (req: Request, res: Response) => {
  const validationService = new ValidationService(req.body);

  await validationService.validateBodyRequest(signInSchema);

  res.status(200).json({ message: 'OK' });
};
