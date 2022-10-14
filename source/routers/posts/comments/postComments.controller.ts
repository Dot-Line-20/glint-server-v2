import { FastifyRequest, FastifyReply } from 'fastify'
import { Post } from '@prisma/client'
import { isPostExists, prisma } from '@library/prisma'

export default async (
  request: FastifyRequest<{
    Params: {
      postId: Post['id']
    }
    Body: Pick<Post, 'content'>
  }>,
  reply: FastifyReply
) => {
  if (!isPostExists(request.params.postId)) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.comment.create({
      select: {
        id: true,
        userId: true,
        postId: true,
        content: true,
        createdAt: true,
      },
      data: Object.assign(request.body, {
        userId: request.userId,
        postId: request.params.postId,
      }),
    })
  )

  return
}
