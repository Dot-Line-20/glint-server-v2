import { FastifyRequest, PayloadReply } from 'fastify'
import { Post, PostLike, User } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
      userId: User['id']
    }
  }>,
  reply: PayloadReply
) => {
  const postLike: PostLike | null = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId: request.params.postId,
        userId: request.params.userId,
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
        postId: request.params.postId,
        userId: request.params.userId,
      },
    },
  })

  reply.send(null)

  return
}
