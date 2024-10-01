import { User } from '@/models/user.model'
import type { Request, Response } from 'express'

export const me = async (req: Request, res: Response) => {
  const user = await User.findById(req.currentUser?.id)

  res.status(200).json({ message: 'OK', data: user })
}
