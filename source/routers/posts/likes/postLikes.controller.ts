import { FastifyRequest, FastifyReply } from 'fastify'
import { Post } from '@prisma/client'
import { isLikeExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    }
  }>,
  reply: FastifyReply
) => {
  if (!(await isLikeExists(request.params.postId, request.userId))) {
    reply.send(new HttpError(400, 'Duplicated liked'))

    return
  }

  reply.send(
    await prisma.postLike.create({
      data: {
        postId: request.params.postId,
        userId: request.userId,
      },
    })
  )

  return
}
