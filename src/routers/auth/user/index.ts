import type { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
  })
}
