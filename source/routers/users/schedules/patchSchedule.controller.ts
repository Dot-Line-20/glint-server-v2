import { FastifyRequest, FastifyReply } from 'fastify'
import {
  Category,
  Prisma,
  PrismaPromise,
  Schedule,
  ScheduleCategory,
  ScheduleRepetition,
  User,
} from '@prisma/client'
import { prisma } from '@library/prisma'
import HttpError from '@library/httpError'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    } & Pick<Schedule, 'id'>
    Body: Partial<
      {
        categoryIds: Category['id'][]
        repetitions: Date[]
      } & Omit<Schedule, 'id' | 'userId' | 'createdAt'>
    >
  }>,
  reply: FastifyReply
) => {
  const isParentScheduleIdDefined: boolean =
    typeof request.body.parentScheduleId === 'number'

  const schedule:
    | ({
        parentSchedule: Pick<Schedule, 'startingAt' | 'endingAt'> | null
      } & Pick<Schedule, 'type' | 'startingAt' | 'endingAt'>)
    | null = await prisma.schedule.findFirst({
    select: {
      type: true,
      startingAt: true,
      endingAt: true,
      parentSchedule: isParentScheduleIdDefined
        ? undefined
        : {
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

  if (request.params.userId !== request.userId) {
    reply.send(new HttpError(401, 'Unauthorized user'))

    return
  }

  if (isParentScheduleIdDefined) {
    schedule.parentSchedule = await prisma.schedule.findUnique({
      where: {
        id: request.body.parentScheduleId as number,
      },
    })
  }

  const hasParentSchedule: boolean = schedule.parentSchedule !== null

  if (isParentScheduleIdDefined && !hasParentSchedule) {
    reply.send(new HttpError(400, 'Invalid parentScheduleId'))

    return
  }

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

  const prismaPromises: PrismaPromise<
    | Schedule
    | ({
        categories: ScheduleCategory[]
        repetitions: ScheduleRepetition[]
      } & Schedule)
    | Prisma.BatchPayload
  >[] = []

  const isRepetitionsDefined: boolean = Array.isArray(request.body.repetitions)

  schedule.type = request.body.type || schedule.type

  if (schedule.type === 0 && isRepetitionsDefined) {
    reply.send(new HttpError(400, 'Invalid type'))

    return
  }

  if (isRepetitionsDefined) {
    const repetitions: ScheduleRepetition[] = []
    const repetitionTimes: Set<number> = new Set<number>()

    for (
      let i = 0;
      i < (request.body as Required<typeof request.body>).repetitions.length;
      i++
    ) {
      const repeatingAt: Date = new Date(1212, 11, 12, 12, 12, 12)

      switch (schedule.type) {
        case 1: {
          repeatingAt.setHours(
            new Date(
              (request.body as Required<typeof request.body>).repetitions[i]
            ).getHours()
          )

          break
        }

        case 2: {
          repeatingAt.setDate(
            ((new Date(
              (request.body as Required<typeof request.body>).repetitions[i]
            ).getDay() +
              1) %
              7) +
              1
          )

          break
        }

        case 3: {
          repeatingAt.setDate(
            new Date(
              (request.body as Required<typeof request.body>).repetitions[i]
            ).getDate()
          )

          break
        }

        //case 4:
        default: {
          repeatingAt.setMonth(
            new Date(
              (request.body as Required<typeof request.body>).repetitions[i]
            ).getMonth()
          )

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
        scheduleId: request.params.id,
        repeatingAt: repeatingAt,
      })
    }

    prismaPromises.push(
      prisma.scheduleRepetition.deleteMany({
        where: {
          scheduleId: request.params.id,
        },
      })
    )

    if (repetitions.length !== 0) {
      prismaPromises.push(
        prisma.scheduleRepetition.createMany({
          data: repetitions,
        })
      )
    }
  }

  if (Array.isArray(request.body.categoryIds)) {
    if (
      (await prisma.category.count({
        where: {
          id: {
            in: request.body.categoryIds,
          },
        },
      })) !== request.body.categoryIds.length
    ) {
      reply.send(new HttpError(400, 'Invalid categoryIds'))

      return
    }

    prismaPromises.push(
      prisma.postCategory.deleteMany({
        where: {
          postId: request.params.id,
        },
      })
    )

    const postCategoryConditions: Prisma.PostCategoryCreateManyInput[] = []

    for (let i = 0; i < request.body.categoryIds.length; i++) {
      postCategoryConditions.push({
        postId: request.params.id,
        categoryId: request.body.categoryIds[i],
      })
    }

    if (postCategoryConditions.length !== 0) {
      prismaPromises.push(
        prisma.postCategory.createMany({
          data: postCategoryConditions,
        })
      )
    }
  }

  prismaPromises.push(
    prisma.schedule.update({
      select: {
        id: true,
        userId: true,
        parentScheduleId: true,
        type: true,
        name: true,
        content: true,
        startingAt: true,
        endingAt: true,
        isSuccess: true,
        createdAt: true,
        categories: true,
        repetitions: true,
      },
      data: Object.assign(request.body, {
        repetitions: undefined,
      }),
      where: {
        id: request.params.id,
      },
    })
  )

  reply.send(
    prismaPromises.length === 1
      ? await prismaPromises[0]
      : (await prisma.$transaction(prismaPromises))[prismaPromises.length - 1]
  )

  return
}
