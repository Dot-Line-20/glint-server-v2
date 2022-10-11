import { FastifyRequest, PayloadReply } from 'fastify'
import { Comment, Post } from '@prisma/client'
import { isCommentExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

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

  if (request.params.id !== request.user.id) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  await prisma.comment.update({
    data: {
      isDeleted: true,
    },
    where: {
      id: request.params.id,
    },
  })

  reply.send(null)

  return
}
