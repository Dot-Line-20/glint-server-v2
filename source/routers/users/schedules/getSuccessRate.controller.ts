import { isUserIdExists, prisma } from '@library/prisma'
import { User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    }
  }>,
  reply: FastifyReply
) => {
  if (!(await isUserIdExists(request.params.userId))) {
    reply.callNotFound()

    return
  }

  const now: Date = new Date()

  reply.send({
    successRate: Math.trunc(
      ((await prisma.schedule.count({
        where: {
          userId: request.params.userId,
          endingAt: {
            lte: now,
          },
          isSuccess: true,
        },
      })) /
        (await prisma.schedule.count({
          where: {
            endingAt: {
              lte: now,
            },
            userId: request.params.userId,
          },
        })) || 1) * 100
    ),
  })

  return
}
