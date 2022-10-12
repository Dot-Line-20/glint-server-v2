import { FastifyRequest, PayloadReply } from 'fastify'
import { Post, PostLike } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
  }>,
  reply: PayloadReply
) => {
  const postLike: PostLike | null = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId: request.params.id,
        userId: request.user.id,
      },
    },
  })

  if (postLike === null) {
    reply.send(new HttpError(400, 'Not liked'))

    return
  }

  await prisma.postLike.delete({
    where: {
      postId_userId: {
        postId: request.params.id,
        userId: request.user.id,
      },
    },
  })

  reply.send(null)

  return
}
