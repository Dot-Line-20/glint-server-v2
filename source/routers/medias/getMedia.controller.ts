import { isMediaExists, prisma } from '@library/prisma'
import { Media } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<Media, 'id'>
  }>,
  reply: FastifyReply
) => {
  if (!(await isMediaExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.media.findUnique({
      where: {
        id: request.params.id,
      },
    })
  )

  return
}
