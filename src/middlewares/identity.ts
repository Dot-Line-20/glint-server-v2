import prisma from 'lib/prisma'
import { verify } from 'lib/token'

import type { Request, Response, NextFunction } from 'express'

export const userCache = new Map<string, any>()

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id } = verify(req.token, false)

  if (userCache.has(id)) {
    req.user = userCache.get(id)
    return next()
  }

 const user = await prisma.user.findUniqueOrThrow({ where: { id } })
  userCache.set(id, user)
  req.user = user
  
  return next()
}
