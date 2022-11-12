import { isUserIdExists, prisma } from '@library/prisma'
import { User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: Pick<User, 'id'>
  }>,
  reply: FastifyReply
) => {
  if (!(await isUserIdExists(request.params.id))) {
    reply.callNotFound()

    return
  }

  const now: Date = new Date()

  const scheduleCount: number = await prisma.schedule.count({
    where: {
      endingAt: {
        lte: now,
      },
      userId: request.params.id,
      NOT: {
        type: 0,
      },
    },
  })

  reply.send({
    successRate:
      scheduleCount !== 0
        ? Math.trunc(
            ((await prisma.schedule.count({
              where: {
                userId: request.params.id,
                endingAt: {
                  lte: now,
                },
                isSuccess: true,
              },
            })) /
              scheduleCount) *
              100
          )
        : 100,
    followers: await prisma.userFollowing.count({
      where: {
        targetUserId: request.userId,
      },
    }),
    followings: await prisma.userFollowing.count({
      where: {
        userId: request.userId,
      },
    }),
  })

  return
}
