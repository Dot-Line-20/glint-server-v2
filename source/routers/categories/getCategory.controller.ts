import { isCategoryExists, prisma } from '@library/prisma'
import { Category } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<Category, 'id'>
  }>,
  reply: FastifyReply
) => {
  if (!(await isCategoryExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  reply.send(
    await prisma.category.findFirst({
      where: {
        id: request.params.id,
      },
    })
  )

  return
}
