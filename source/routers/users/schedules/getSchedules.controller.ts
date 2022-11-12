import HttpError from '@library/httpError'
import { isUserIdExists, prisma } from '@library/prisma'
import { PageQuery } from '@library/type'
import { Prisma, Schedule, User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export default async (
  request: FastifyRequest<{
    Params: {
      userId: User['id']
    }
    Querystring: Partial<
      {
        depth: number
        isParent: boolean
        from: Date
        to: Date
      } & Pick<Schedule, 'isSuccess'> &
        PageQuery
    >
  }>,
  reply: FastifyReply
) => {
  if (!(await isUserIdExists(request.params.userId))) {
    reply.callNotFound()

    return
  }

  request.query['page[size]'] ||= 50
  request.query['page[index]'] ||= 0

  const scheduleCondition: Prisma.ScheduleWhereInput = {}

  const isToDefined: boolean = typeof request.query.to === 'object'

  if (typeof request.query.from === 'object') {
    scheduleCondition.startingAt = {
      gte: request.query.from,
    }

    if (isToDefined && request.query.from > (request.query.to as Date)) {
      reply.send(new HttpError(400, 'Invalid from'))

      return
    }
  }

  if (isToDefined) {
    scheduleCondition.endingAt = {
      lte: request.query.from,
    }
  }

  const selection: Prisma.ScheduleSelect = {
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
  }

  if (typeof request.query.depth === 'number') {
    let currentSelection: Prisma.ScheduleSelect = selection

    while (request.query.depth--) {
      currentSelection.childSchedules = {
        select: Object.assign({}, selection, { childSchedules: false }),
        where: scheduleCondition,
      }

      currentSelection = currentSelection.childSchedules
        .select as Prisma.ScheduleSelect
    }
  }

  reply.send(
    await prisma.schedule.findMany({
      select: selection,
      where: Object.assign(
        {
          parentScheduleId: request.query.isParent === true ? null : undefined,
          userId: request.params.userId,
          isSuccess: request.query.isSuccess,
        },
        scheduleCondition
      ),
      skip: request.query['page[size]'] * request.query['page[index]'],
      take: request.query['page[size]'],
      orderBy: {
        id: request.query['page[order]'] === 'asc' ? 'asc' : 'desc',
      },
    })
  )

  return
}
