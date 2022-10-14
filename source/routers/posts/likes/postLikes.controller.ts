import { FastifyRequest, FastifyReply } from 'fastify'
import { Post, PostLike } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    }
  }>,
  reply: FastifyReply
) => {
  const postLike: PostLike | null = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId: request.params.postId,
        userId: request.userId,
      },
    },
  })

  if (postLike !== null) {
    reply.send(new HttpError(400, 'Already liked'))

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
