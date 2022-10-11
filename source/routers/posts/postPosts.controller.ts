import { FastifyRequest, PayloadReply } from 'fastify'
import { Post } from '@prisma/client'
import { prisma } from '@library/prisma'

export default async (
  request: FastifyRequest<{
    Body: Pick<Post, 'title' | 'content'>
  }>,
  reply: PayloadReply
) => {
  reply.send(
    await prisma.post.create({
      select: {
        postMedias: true,
      },
      data: Object.assign(request.body, {
        userId: request.user.id,
      }),
    })
  )

  return
}
