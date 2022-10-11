import { FastifyRequest, PayloadReply } from 'fastify'
import { Schedule, User } from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    } & Pick<Schedule, 'id'>
    Body: Partial<
      Pick<
        Schedule,
        'parentScheduleId' | 'name' | 'startingAt' | 'endingAt' | 'isSuccess'
      >
    >
  }>,
  reply: PayloadReply
) => {
  const schedule:
    | ({
        parentSchedule: Pick<Schedule, 'startingAt' | 'endingAt'> | null
      } & Pick<Schedule, 'startingAt' | 'endingAt'>)
    | null = await prisma.schedule.findFirst({
    select: {
      startingAt: true,
      endingAt: true,
      parentSchedule: {
        select: {
          startingAt: true,
          endingAt: true,
        },
      },
    },
    where: {
      id: request.params.id,
      userId: request.params.userId,
    },
  })

  if (schedule === null) {
    reply.callNotFound()

    return
  }

  if (request.params.userId !== request.user.id) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  const hasParentSchedule: boolean = schedule.parentSchedule !== null

  if (
    typeof request.body.endingAt === 'object' &&
    (request.body.endingAt <= new Date() ||
      (hasParentSchedule &&
        request.body.endingAt >
          (schedule.parentSchedule as Pick<Schedule, 'startingAt' | 'endingAt'>)
            .endingAt))
  ) {
    reply.send(new HttpError(400, 'Invalid startingAt'))

    return
  }

  if (
    typeof request.body.startingAt === 'object' &&
    (request.body.startingAt >= (request.body.endingAt || schedule.endingAt) ||
      (hasParentSchedule &&
        request.body.startingAt <
          (schedule.parentSchedule as Pick<Schedule, 'startingAt' | 'endingAt'>)
            .startingAt))
  ) {
    reply.send(new HttpError(400, 'Invalid endingAt'))

    return
  }

  reply.send(
    await prisma.schedule.update({
      data: request.body,
      where: {
        id: request.params.id,
      },
    })
  )

  return
}
