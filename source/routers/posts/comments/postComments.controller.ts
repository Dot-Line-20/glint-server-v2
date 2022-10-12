import { FastifyRequest, PayloadReply } from 'fastify'
import { Post } from '@prisma/client'
import { isPostExists, prisma } from '@library/prisma'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    }
    Body: Pick<Post, 'content'>
  }>,
  reply: PayloadReply
) => {
  if (!isPostExists(request.params.postId)) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.comment.create({
      data: Object.assign(request.body, {
        userId: request.user.id,
        postId: request.params.postId,
      }),
    })
  )

  return
}
