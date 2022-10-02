import { FastifyRequest, PayloadReply } from 'fastify'
import { User } from '@prisma/client'
import prisma from '@library/prisma'
import HttpError from '@library/httpError'
import { isUserIdExist } from '@library/existence'

export default async (
  request: FastifyRequest<{
    Params: Pick<User, 'id'>
    Body: Partial<Omit<User, 'id' | 'verificationKey' | 'createdAt'>>
  }>,
  reply: PayloadReply
) => {
  if (!(await isUserIdExist(request.params.id))) {
    reply.callNotFound()

    return
  }

  if (request.params.id !== request.user.id) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  reply.send(
    await prisma.user.update({
      data: request.body,
      where: request.params,
    })
  )

  return
}
