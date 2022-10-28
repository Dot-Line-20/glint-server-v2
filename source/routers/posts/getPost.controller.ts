import { isPostExists, prisma } from '@library/prisma'
import { Post } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
  }>,
  reply: FastifyReply
) => {
  if (!(await isPostExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.post.findUnique({
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        createdAt: true,
        medias: {
          select: {
						index: true,
            media: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      where: {
        id: request.params.id,
      },
    })
  )

  return
}
