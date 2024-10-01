import type { Request, Response } from 'express'

export const signOut = (req: Request, res: Response) => {
  req.session = null

  res.status(200).json({ message: 'User signed out successfully', data: null })
}
