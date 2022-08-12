import { verify, issue } from 'lib/token'

import type { Request, Response, NextFunction } from 'express'

export default async (req: Request, res: Response) => {
  res.json(issue(verify(req.token, true).id))
}
