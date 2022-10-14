import { FastifyRequest, FastifyReply } from 'fastify'
import { Post } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
    Body: Pick<Post, 'title' | 'content'>
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

  reply.send(
    await prisma.post.update({
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        createdAt: true,
        medias: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
      where: {
        id: request.params.id,
      },
      data: request.body,
    })
  )

  return
}
