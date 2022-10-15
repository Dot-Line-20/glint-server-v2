import { FastifyRequest, FastifyReply } from 'fastify'
import { Schedule, User } from '@prisma/client'
import { isUserIdExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    }
    Body: Pick<
      Schedule,
      'parentScheduleId' | 'name' | 'startingAt' | 'endingAt'
    >
  }>,
  reply: FastifyReply
) => {
  if (!(await isUserIdExists(request.params.userId))) {
    reply.callNotFound()

    return
  }

  if (request.params.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  const hasParentSchedule: boolean =
    typeof request.body.parentScheduleId === 'number'
  const parentSchedule: Pick<Schedule, 'startingAt' | 'endingAt'> | null =
    hasParentSchedule
      ? await prisma.schedule.findFirst({
          select: {
            startingAt: true,
            endingAt: true,
          },
          where: {
            id: request.body.parentScheduleId as number,
            userId: request.params.userId,
          },
        })
      : null

  if (hasParentSchedule && parentSchedule === null) {
    reply.send(new HttpError(400, 'Invalid parentScheduleId'))

    return
  }

  if (
    request.body.startingAt >= request.body.endingAt ||
    (hasParentSchedule &&
      request.body.startingAt <
        (parentSchedule as Pick<Schedule, 'startingAt' | 'endingAt'>)
          .startingAt)
  ) {
    reply.send(new HttpError(400, 'Invalid startingAt'))

    return
  }

  if (
    request.body.endingAt <= new Date() ||
    (hasParentSchedule &&
      request.body.endingAt >
        (parentSchedule as Pick<Schedule, 'startingAt' | 'endingAt'>).endingAt)
  ) {
    reply.send(new HttpError(400, 'Invalid endingAt'))

    return
  }

  reply.send(
    await prisma.schedule.create({
      data: Object.assign(request.body, {
        userId: request.params.userId,
        startingAt: new Date(request.body.startingAt),
        endingAt: new Date(request.body.endingAt),
      }),
    })
  )

  return
}
