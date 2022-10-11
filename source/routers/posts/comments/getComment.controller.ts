import { isCommentExists, prisma } from '@library/prisma'
import { Comment, Post } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    } & Pick<Comment, 'id'>
  }>,
  reply: PayloadReply
) => {
  if (!isCommentExists(request.params.postId, request.params.id)) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.comment.findUnique({
      where: {
        id: request.params.id,
      },
    })
  )

  return
}
