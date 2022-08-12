import prisma from 'lib/prisma'
import { HttpError } from 'lib/error'
import { Prisma } from '@prisma/client'
import { issue, sha256 } from 'lib/token'

import type { SignUpRequest } from 'interface/body'
import type { Response } from 'express'

export default async (req: SignUpRequest, res: Response) => {
  try {
    const { email, password, name } = req.body

    const { id } = await prisma.user.create({
      data: { email, password: sha256(password), name },
      select: { id: true },
    })

    res.json({ ...issue(id) })
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta) {
        const target = (error.meta.target as string[])[0]
        if (target === 'email') {
          throw new HttpError(400, '이미 존재하는 이메일입니다.')
        }
        if (target === 'name') {
          throw new HttpError(400, '이미 존재하는 이름입니다.')
        }
      }
    }

    throw new HttpError(500, '서버 오류입니다.')
  }
}
