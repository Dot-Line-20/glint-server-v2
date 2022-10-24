import { FastifyRequest, FastifyReply } from 'fastify'
import { Schedule, ScheduleRepetition, User } from '@prisma/client'
import { isUserIdExists, prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    }
    Body: {
      repetitions: Date[]
    } & Pick<
      Schedule,
      'parentScheduleId' | 'type' | 'name' | 'startingAt' | 'endingAt'
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

  if (request.body.type === 0 && request.body.repetitions.length !== 0) {
    reply.send(new HttpError(400, 'Invalid type'))

    return
  }

  const repetitions: Pick<ScheduleRepetition, 'repeatingAt'>[] = []
  const repetitionTimes: Set<number> = new Set<number>()

  for (let i = 0; i < request.body.repetitions.length; i++) {
    const repeatingAt: Date = new Date(1212, 11, 12, 12, 12, 12)

    switch (request.body.type) {
      case 1: {
        repeatingAt.setHours(new Date(request.body.repetitions[i]).getHours())

        break
      }

      case 2: {
        repeatingAt.setDate(
          ((new Date(request.body.repetitions[i]).getDay() + 1) % 7) + 1
        )

        break
      }

      case 3: {
        repeatingAt.setDate(new Date(request.body.repetitions[i]).getDate())

        break
      }

      //case 4:
      default: {
        repeatingAt.setMonth(new Date(request.body.repetitions[i]).getMonth())

        break
      }
    }

    const repetitionTime: number = repeatingAt.getTime()

    if (repetitionTimes.has(repetitionTime)) {
      reply.send(new HttpError(409, 'Duplicated repetitions'))

      return
    }

    repetitionTimes.add(repetitionTime)

    repetitions.push({
      repeatingAt: repeatingAt,
    })
  }

  reply.send(
    await prisma.schedule.create({
      select: {
        id: true,
        userId: true,
        parentScheduleId: true,
        type: true,
        name: true,
        startingAt: true,
        endingAt: true,
        isSuccess: true,
        createdAt: true,
        categories: true,
        repetitions: true,
      },
      data: Object.assign(request.body, {
        userId: request.params.userId,
        startingAt: new Date(request.body.startingAt),
        endingAt: new Date(request.body.endingAt),
        repetitions: {
          createMany: {
            data: repetitions,
          },
        },
      }),
    })
  )

  return
}
