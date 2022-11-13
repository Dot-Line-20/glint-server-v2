import HttpError from '@library/httpError'
import { prisma } from '@library/prisma'
import { Report, User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    } & Pick<Report, 'id'>
  }>,
  reply: FastifyReply
) => {
  const report: Pick<Report, 'userId'> | null = await prisma.report.findUnique({
    select: {
      userId: true,
    },
    where: {
      id: request.params.id,
    },
  })

  if (report === null) {
    reply.callNotFound()

    return
  }

  if (report.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  await prisma.report.delete({
    where: {
      id: request.params.id,
    },
  })

  reply.send(null)

  return
}
