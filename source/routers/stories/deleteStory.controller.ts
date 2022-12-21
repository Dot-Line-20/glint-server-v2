import { FastifyRequest, FastifyReply } from 'fastify'
import { Story } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<Story, 'id'>
  }>,
  reply: FastifyReply
) => {
  const story: Pick<Story, 'userId'> | null = await prisma.story.findUnique({
    select: {
      userId: true,
    },
    where: {
      id: request.params.id,
    },
  })

  if (story === null) {
    reply.callNotFound()

    return
  }

  if (story.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  await prisma.story.update({
    data: {
      isDeleted: true,
    },
    where: {
      id: request.params.id,
    },
  })

  reply.send(null)

  return
}
