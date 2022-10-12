import { FastifyRequest, PayloadReply } from 'fastify'
import { Post } from '@prisma/client'
import { isPostExists, prisma } from '@library/prisma'

export default async (
  request: FastifyRequest<{
    Params: Pick<Post, 'id'>
  }>,
  reply: PayloadReply
) => {
  if (!isPostExists(request.params.id)) {
    reply.callNotFound()

    return
  }

  await prisma.post.update({
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
