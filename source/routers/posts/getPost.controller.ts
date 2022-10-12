import { isPostExists, prisma } from '@library/prisma'
import { Post } from '@prisma/client'
import { FastifyRequest, PayloadReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
  }>,
  reply: PayloadReply
) => {
  if (!(await isPostExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.post.findUnique({
      select: {
        postMedias: true,
      },
      where: {
        id: request.params.id,
      },
    })
  )

  return
}
