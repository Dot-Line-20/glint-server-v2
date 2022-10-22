import { FastifyRequest, FastifyReply } from 'fastify'
import { Comment, Post } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    } & Pick<Comment, 'id'>
    Body: Pick<Comment, 'content'>
  }>,
  reply: FastifyReply
) => {
  const comment: Pick<Comment, 'userId'> | null =
    await prisma.comment.findFirst({
      select: {
        userId: true,
      },
      where: {
        postId: request.params.postId,
        id: request.params.id,
      },
    })

  if (comment === null) {
    reply.callNotFound()

    return
  }

  if (comment.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  reply.send(
    await prisma.comment.update({
      select: {
        id: true,
        userId: true,
        postId: true,
        content: true,
        createdAt: true,
      },
      where: {
        id: request.params.id,
      },
      data: request.body,
    })
  )

  return
}
