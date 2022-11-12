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
  const post: {
    likes: Pick<PostLike, 'userId'>[]
  } | null = await prisma.post.findUnique({
    select: {
      likes: {
        select: {
          userId: true,
        },
        where: {
          userId: request.userId,
        },
      },
    },
    where: {
      id: request.params.postId,
    },
  })

  if (post === null) {
    reply.callNotFound()

    return
  }

  if (post.likes.length !== 0) {
    reply.send(new HttpError(409, 'Duplicated like'))

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
