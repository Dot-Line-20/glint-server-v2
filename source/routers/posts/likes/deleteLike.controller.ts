import { FastifyRequest, FastifyReply } from 'fastify'
import { Post, User } from '@prisma/client'
import { isLikeExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
      userId: User['id']
    }
  }>,
  reply: FastifyReply
) => {
  if (await isLikeExists(request.params.postId, request.params.userId)) {
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
