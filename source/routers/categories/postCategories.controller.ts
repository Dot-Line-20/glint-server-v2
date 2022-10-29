import { FastifyRequest, FastifyReply } from 'fastify'
import { Category } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Body: Pick<Category, 'name'>
  }>,
  reply: FastifyReply
) => {
  if (
    (await prisma.category.count({
      where: {
        name: request.body.name,
      },
    })) !== 0
  ) {
    reply.send(new HttpError(409, 'Duplicated name'))

    return
  }

  reply.send(
    await prisma.category.create({
      data: request.body,
    })
  )

  return
}
