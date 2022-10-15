import { isCommentExists, prisma } from '@library/prisma'
import { Comment, Post } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    } & Pick<Comment, 'id'>
  }>,
  reply: FastifyReply
) => {
  if (!isCommentExists(request.params.postId, request.params.id)) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.comment.findUnique({
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
    })
  )

  return
}
