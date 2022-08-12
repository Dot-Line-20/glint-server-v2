import prisma from 'lib/prisma'
import { HttpError } from 'lib/error'
import { issue, sha256 } from 'lib/token'

import type { SignInRequest } from 'interface/body'
import type { Response, NextFunction } from 'express'

export default async (
  req: SignInRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email_password: { email, password: sha256(password) } },
  })

  if (!user) {
    return next(new HttpError(401, '아이디 또는 비밀번호가 잘못되었습니다.'))
  }

  res.json({ ...issue(user.id) })
}
