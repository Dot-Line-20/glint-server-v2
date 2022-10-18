import { FastifyRequest, FastifyReply } from 'fastify'
import { User } from '@prisma/client'
import {
  isUserEmailExists,
  isUserIdExists,
  prisma,
} from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<User, 'id'>
    Body: Partial<Pick<User, 'email' | 'password' | 'name' | 'birth'>>
  }>,
  reply: FastifyReply
) => {
  if (!(await isUserIdExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  if (request.params.id !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  if (
    typeof request.body.email === 'string' &&
    (await isUserEmailExists(request.body.email))
  ) {
    reply.send(new HttpError(400, 'Duplicated email'))

    return
  }

  reply.send(
    await prisma.user.update({
      select: {
        id: true,
        email: true,
        name: true,
        birth: true,
        media: true,
        createdAt: true,
      },
      data: request.body,
      where: request.params,
    })
  )

  return
}
