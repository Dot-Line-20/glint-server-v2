import HttpError from '@library/httpError'
import { isUserIdExists, prisma } from '@library/prisma'
import { User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<User, 'id'>
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

  await prisma.user.delete({
    where: request.params,
  })

  reply.send(null)

  return
}
