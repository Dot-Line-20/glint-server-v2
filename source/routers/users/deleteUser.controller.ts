import { isUserExists } from '@library/existence'
import HttpError from '@library/httpError'
import prisma from '@library/prisma'
import { User } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<User, 'id'>
  }>,
  reply: PayloadReply
) => {
  if (!(await isUserExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  if (request.params.id !== request.user.id) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  await prisma.user.delete({
    where: request.params,
  })

  reply.send(null)

  return
}
