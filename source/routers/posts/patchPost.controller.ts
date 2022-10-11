import { FastifyRequest, PayloadReply } from 'fastify'
import { Post } from '@prisma/client'
import { isPostExists, prisma } from '@library/prisma'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
    Body: Pick<Post, 'title' | 'content'>
  }>,
  reply: PayloadReply
) => {
  if (!isPostExists(request.params.id)) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.post.update({
      select: {
        postMedias: true,
      },
      where: {
        id: request.params.id,
      },
      data: request.body,
    })
  )

  return
}
