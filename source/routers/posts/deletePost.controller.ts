import { FastifyRequest, FastifyReply } from 'fastify'
import { Post } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
  }>,
  reply: FastifyReply
) => {
  const post: Pick<Post, 'userId'> | null = await prisma.post.findUnique({
    select: {
      userId: true,
    },
    where: {
      id: request.params.id,
    },
  })

  if (post === null) {
    reply.callNotFound()

    return
  }

  if (post.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  await prisma.post.update({
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
